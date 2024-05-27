import { Either, left, right } from '@/core/types/either'

import { Parcel, ParcelStatus } from '../../enterprise/entities/parcel'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ParcelOwnedByAnotherUserError } from './errors/parcel-owned-by-another-user-error'
import { InvalidStatusForActionOverParcelError } from './errors/invalid-status-for-action-over-parcel-error'
import { AttachmentsRepository } from '../repositories/attachments-repository'

interface DeliverParcelUseCaseRequest {
  parcelId: string
  deliveryPersonId: string
  attachmentId: string
}

type DeliverParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

export class DeliverParcelUseCase {
  constructor(
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private attachmentsRepository: AttachmentsRepository,
    private parcelsRepository: ParcelsRepository,
  ) {}

  async execute({
    parcelId,
    deliveryPersonId,
    attachmentId,
  }: DeliverParcelUseCaseRequest): Promise<DeliverParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)
    if (!parcel) {
      return left(new ResourceNotFoundError())
    }
    const attachment = await this.attachmentsRepository.findById(attachmentId)
    if (!attachment) {
      return left(new ResourceNotFoundError())
    }
    if (parcel.status !== ParcelStatus.TAKEN) {
      return left(
        new InvalidStatusForActionOverParcelError(
          ParcelStatus[ParcelStatus.TAKEN],
        ),
      )
    }
    const deliveryPerson =
      await this.deliveryPersonsRepository.findById(deliveryPersonId)
    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }
    if (!parcel.deliveredBy?.equals(deliveryPerson.id)) {
      return left(new ParcelOwnedByAnotherUserError(parcel.id.toString()))
    }
    parcel.deliver(attachment.id)
    await this.parcelsRepository.save(parcel)
    return right({ parcel })
  }
}

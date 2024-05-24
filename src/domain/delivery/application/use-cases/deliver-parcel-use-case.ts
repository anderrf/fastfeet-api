import { Either, left, right } from '@/core/types/either'

import { Parcel, ParcelStatus } from '../../enterprise/entities/parcel'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeliverParcelUseCaseRequest {
  parcelId: string
  deliveryPersonId: string
}

type DeliverParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

export class DeliverParcelUseCase {
  constructor(
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private parcelsRepository: ParcelsRepository,
  ) {}

  async execute({
    parcelId,
    deliveryPersonId,
  }: DeliverParcelUseCaseRequest): Promise<DeliverParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)
    if (!parcel) {
      return left(new ResourceNotFoundError())
    }
    if (parcel.status !== ParcelStatus.TAKEN) {
      return left(new ResourceNotFoundError())
    }
    const deliveryPerson =
      await this.deliveryPersonsRepository.findById(deliveryPersonId)
    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }
    if (!parcel.deliveredBy?.equals(deliveryPerson.id)) {
      return left(new ResourceNotFoundError())
    }
    parcel.deliver()
    await this.parcelsRepository.save(parcel)
    return right({ parcel })
  }
}

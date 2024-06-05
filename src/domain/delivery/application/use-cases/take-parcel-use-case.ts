import { Either, left, right } from '@/core/types/either'

import { Parcel, ParcelStatus } from '../../enterprise/entities/parcel'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidStatusForActionOverParcelError } from './errors/invalid-status-for-action-over-parcel-error'
import { Injectable } from '@nestjs/common'

interface TakeParcelUseCaseRequest {
  parcelId: string
  deliveryPersonId: string
}

type TakeParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

@Injectable()
export class TakeParcelUseCase {
  constructor(
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private parcelsRepository: ParcelsRepository,
  ) {}

  async execute({
    parcelId,
    deliveryPersonId,
  }: TakeParcelUseCaseRequest): Promise<TakeParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)
    if (!parcel) {
      return left(new ResourceNotFoundError())
    }
    if (parcel.status !== ParcelStatus.READY) {
      return left(
        new InvalidStatusForActionOverParcelError(
          ParcelStatus[ParcelStatus.READY],
        ),
      )
    }
    const deliveryPerson =
      await this.deliveryPersonsRepository.findById(deliveryPersonId)
    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }
    parcel.take(deliveryPerson.id)
    await this.parcelsRepository.save(parcel)
    return right({ parcel })
  }
}

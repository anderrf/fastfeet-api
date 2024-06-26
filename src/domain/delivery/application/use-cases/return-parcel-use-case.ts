import { Either, left, right } from '@/core/types/either'

import { Parcel, ParcelStatus } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidStatusForActionOverParcelError } from './errors/invalid-status-for-action-over-parcel-error'
import { Injectable } from '@nestjs/common'

interface ReturnParcelUseCaseRequest {
  parcelId: string
  deliveryPersonId: string
}

type ReturnParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

@Injectable()
export class ReturnParcelUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
  }: ReturnParcelUseCaseRequest): Promise<ReturnParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)
    if (!parcel) {
      return left(new ResourceNotFoundError())
    }
    if (parcel.status !== ParcelStatus.DELIVERED) {
      return left(
        new InvalidStatusForActionOverParcelError(
          ParcelStatus[ParcelStatus.DELIVERED],
        ),
      )
    }
    parcel.return()
    await this.parcelsRepository.save(parcel)
    return right({ parcel })
  }
}

import { Either, left, right } from '@/core/types/either'

import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ReturnParcelUseCaseRequest {
  parcelId: string
  deliveryPersonId: string
}

type ReturnParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

export class ReturnParcelUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
  }: ReturnParcelUseCaseRequest): Promise<ReturnParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)
    if (!parcel) {
      return left(new ResourceNotFoundError())
    }
    parcel.return()
    await this.parcelsRepository.save(parcel)
    return right({ parcel })
  }
}

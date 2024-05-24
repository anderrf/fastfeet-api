import { Either, left, right } from '@/core/types/either'

import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteParcelUseCaseRequest {
  parcelId: string
}

type DeleteParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

export class DeleteParcelUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
  }: DeleteParcelUseCaseRequest): Promise<DeleteParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)
    if (!parcel) {
      return left(new ResourceNotFoundError())
    }
    await this.parcelsRepository.delete(parcel)
    return right({ parcel })
  }
}

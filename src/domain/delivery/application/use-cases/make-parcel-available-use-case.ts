import { Either, left, right } from '@/core/types/either'

import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface MakeParcelAvailableUseCaseRequest {
  parcelId: string
  deliveryPersonId: string
}

type MakeParcelAvailableUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

@Injectable()
export class MakeParcelAvailableUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
  }: MakeParcelAvailableUseCaseRequest): Promise<MakeParcelAvailableUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)
    if (!parcel) {
      return left(new ResourceNotFoundError())
    }
    parcel.makeAvailable()
    await this.parcelsRepository.save(parcel)
    return right({ parcel })
  }
}

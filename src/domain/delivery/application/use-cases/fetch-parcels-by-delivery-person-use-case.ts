import { Either, right } from '@/core/types/either'

import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { Injectable } from '@nestjs/common'

interface FetchParcelsByDeliveryPersonUseCaseRequest {
  deliveryPersonId: string
}

type FetchParcelsByDeliveryPersonUseCaseResponse = Either<
  null,
  { parcels: Parcel[] }
>

@Injectable()
export class FetchParcelsByDeliveryPersonUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    deliveryPersonId,
  }: FetchParcelsByDeliveryPersonUseCaseRequest): Promise<FetchParcelsByDeliveryPersonUseCaseResponse> {
    const parcels =
      await this.parcelsRepository.findManyByDeliveryPersonId(deliveryPersonId)
    return right({ parcels })
  }
}

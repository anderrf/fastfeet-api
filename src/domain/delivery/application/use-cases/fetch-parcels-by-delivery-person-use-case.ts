import { Either, right } from '@/core/types/either'

import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'

interface FetchParcelsByDeliveryPersonUseCaseRequest {
  deliveryPersonId: string
}

type FetchParcelsByDeliveryPersonUseCaseResponse = Either<
  null,
  { parcels: Parcel[] }
>

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

import { Either, right } from '@/core/types/either'

import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'

interface FetchNearbyParcelsUseCaseRequest {
  deliveryPersonId: string
  latitude: number
  longitude: number
}

type FetchNearbyParcelsUseCaseResponse = Either<null, { parcels: Parcel[] }>

export class FetchNearbyParcelsUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    deliveryPersonId,
    latitude,
    longitude,
  }: FetchNearbyParcelsUseCaseRequest): Promise<FetchNearbyParcelsUseCaseResponse> {
    const parcels = await this.parcelsRepository.findManyNearbyDeliveryPerson(
      deliveryPersonId,
      { latitude, longitude },
    )
    return right({ parcels })
  }
}

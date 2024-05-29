import { Either, right } from '@/core/types/either'

import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { Injectable } from '@nestjs/common'

type FetchAvailableParcelsToTakeUseCaseResponse = Either<
  null,
  { parcels: Parcel[] }
>

@Injectable()
export class FetchAvailableParcelsToTakeUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute(): Promise<FetchAvailableParcelsToTakeUseCaseResponse> {
    const parcels = await this.parcelsRepository.findManyAvailable()
    return right({ parcels })
  }
}

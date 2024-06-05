import { Either, left, right } from '@/core/types/either'
import { AddressesRepository } from '@/domain/delivery/application/repositories/addresses-repository'

import { Parcel } from '../../enterprise/entities/parcel'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditParcelUseCaseRequest {
  parcelId: string
  addressId: string
  title: string
  description: string
}

type EditParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

@Injectable()
export class EditParcelUseCase {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    parcelId,
    addressId,
    title,
    description,
  }: EditParcelUseCaseRequest): Promise<EditParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId)
    if (!parcel) {
      return left(new ResourceNotFoundError())
    }
    const newAddress = await this.addressesRepository.findById(addressId)
    if (!newAddress) {
      return left(new ResourceNotFoundError())
    }
    if (!newAddress.addresseeId.equals(parcel.addresseeId)) {
      return left(new ResourceNotFoundError())
    }
    const parcelToUpdate = Parcel.create(
      {
        addressId: parcel.addressId,
        addresseeId: parcel.addresseeId,
        title,
        description,
      },
      parcel.id,
    )
    await this.parcelsRepository.save(parcelToUpdate)
    return right({ parcel: parcelToUpdate })
  }
}

import { Either, left, right } from '@/core/types/either'

import { Address } from '../../enterprise/entities/address'
import { AddressesRepository } from '../repositories/addresses-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ZipCode } from '../../enterprise/entities/value-objects/zip-code'
import { Injectable } from '@nestjs/common'

interface EditAddressUseCaseRequest {
  addressId: string
  street: string
  number: number
  district: string
  zipCode: string
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
}

type EditAddressUseCaseResponse = Either<
  ResourceNotFoundError,
  { address: Address }
>

@Injectable()
export class EditAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    addressId,
    street,
    number,
    district,
    zipCode,
    city,
    state,
    country,
    latitude,
    longitude,
  }: EditAddressUseCaseRequest): Promise<EditAddressUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId)
    if (!address) {
      return left(new ResourceNotFoundError())
    }
    const addressToUpdate = Address.create(
      {
        street,
        number,
        district,
        zipCode: ZipCode.createFromText(zipCode),
        city,
        state,
        country,
        latitude,
        longitude,
        addresseeId: address.addresseeId,
      },
      address.id,
    )
    await this.addressesRepository.save(addressToUpdate)
    return right({ address: addressToUpdate })
  }
}

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/types/either'
import { AddresseesRepository } from '@/domain/delivery/application/repositories/addressees-repository'

import { Address } from '../../enterprise/entities/address'
import { AddressesRepository } from '../repositories/addresses-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ZipCode } from '../../enterprise/entities/value-objects/zip-code'

interface CreateAddressUseCaseRequest {
  street: string
  number: number
  district: string
  zipCode: string
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
  addresseeId: string
}

type CreateAddressUseCaseResponse = Either<
  ResourceNotFoundError,
  { address: Address }
>

export class CreateAddressUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private addresseesRepository: AddresseesRepository,
  ) {}

  async execute({
    street,
    number,
    district,
    zipCode,
    city,
    state,
    country,
    latitude,
    longitude,
    addresseeId,
  }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const addressee = this.addresseesRepository.findById(addresseeId)
    if (!addressee) {
      return left(new ResourceNotFoundError())
    }
    const address = Address.create({
      street,
      number,
      district,
      zipCode: ZipCode.createFromText(zipCode),
      city,
      state,
      country,
      latitude,
      longitude,
      addresseeId: new UniqueEntityId(addresseeId),
    })
    await this.addressesRepository.create(address)
    return right({ address })
  }
}

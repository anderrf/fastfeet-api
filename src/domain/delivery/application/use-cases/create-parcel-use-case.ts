import { Either, left, right } from '@/core/types/either'

import { Parcel } from '../../enterprise/entities/parcel'
import { AddressesRepository } from '../repositories/addresses-repository'
import { ParcelsRepository } from '../repositories/parcels-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AddresseesRepository } from '../repositories/addressees-repository'

interface CreateParcelUseCaseRequest {
  addressId: string
  addresseeId: string
  title: string
  description: string
}

type CreateParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>

export class CreateParcelUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private addresseesRepository: AddresseesRepository,
    private parcelsRepository: ParcelsRepository,
  ) {}

  async execute({
    addresseeId,
    addressId,
    title,
    description,
  }: CreateParcelUseCaseRequest): Promise<CreateParcelUseCaseResponse> {
    const addressee = await this.addresseesRepository.findById(addresseeId)
    if (!addressee) {
      return left(new ResourceNotFoundError())
    }
    const address = await this.addressesRepository.findById(addressId)
    if (!address) {
      return left(new ResourceNotFoundError())
    }
    if (!addressee.id.equals(address.addresseeId)) {
      return left(new ResourceNotFoundError())
    }
    const parcel = Parcel.create({
      title,
      description,
      addressId: address.id,
      addresseeId: new UniqueEntityId(addresseeId),
    })
    await this.parcelsRepository.create(parcel)
    return right({ parcel })
  }
}

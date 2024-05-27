import { Either, left, right } from '@/core/types/either'

import { Address } from '../../enterprise/entities/address'
import { AddressesRepository } from '../repositories/addresses-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteAddressUseCaseRequest {
  addressId: string
}

type DeleteAddressUseCaseResponse = Either<
  ResourceNotFoundError,
  { address: Address }
>

export class DeleteAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    addressId,
  }: DeleteAddressUseCaseRequest): Promise<DeleteAddressUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId)
    if (!address) {
      return left(new ResourceNotFoundError())
    }
    await this.addressesRepository.delete(address)
    return right({ address })
  }
}

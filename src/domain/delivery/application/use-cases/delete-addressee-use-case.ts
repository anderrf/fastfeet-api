import { Either, left, right } from '@/core/types/either'

import { Addressee } from '../../enterprise/entities/addressee'
import { AddresseesRepository } from '../repositories/addressees-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteAddresseeUseCaseRequest {
  addresseeId: string
}

type DeleteAddresseeUseCaseResponse = Either<
  ResourceNotFoundError,
  { addressee: Addressee }
>

export class DeleteAddresseeUseCase {
  constructor(private addresseesRepository: AddresseesRepository) {}

  async execute({
    addresseeId,
  }: DeleteAddresseeUseCaseRequest): Promise<DeleteAddresseeUseCaseResponse> {
    const addressee = await this.addresseesRepository.findById(addresseeId)
    if (!addressee) {
      return left(new ResourceNotFoundError())
    }
    await this.addresseesRepository.delete(addressee)
    return right({ addressee })
  }
}

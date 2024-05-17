import { Either, left, right } from '@/core/types/either'

import { DeliveryPerson } from '../../enterprise/entities/delivery-person'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteDeliveryPersonUseCaseRequest {
  cpf: string
}

type DeleteDeliveryPersonUseCaseResponse = Either<
  ResourceNotFoundError,
  { deliveryperson: DeliveryPerson }
>

export class DeleteDeliveryPersonUseCase {
  constructor(private deliverypersonsRepository: DeliveryPersonsRepository) {}

  async execute({
    cpf,
  }: DeleteDeliveryPersonUseCaseRequest): Promise<DeleteDeliveryPersonUseCaseResponse> {
    const deliveryperson = await this.deliverypersonsRepository.findByCpf(cpf)
    if (!deliveryperson) {
      return left(new ResourceNotFoundError())
    }
    await this.deliverypersonsRepository.delete(deliveryperson)
    return right({ deliveryperson })
  }
}

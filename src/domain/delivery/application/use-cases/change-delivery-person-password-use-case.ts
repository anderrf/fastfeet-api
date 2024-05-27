import { Either, left, right } from '@/core/types/either'

import { DeliveryPerson } from '../../enterprise/entities/delivery-person'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ChangeDeliveryPersonPasswordUseCaseRequest {
  password: string
  deliveryPersonId: string
}

type ChangeDeliveryPersonPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  { deliveryperson: DeliveryPerson }
>

export class ChangeDeliveryPersonPasswordUseCase {
  constructor(
    private deliverypersonsRepository: DeliveryPersonsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    password,
    deliveryPersonId,
  }: ChangeDeliveryPersonPasswordUseCaseRequest): Promise<ChangeDeliveryPersonPasswordUseCaseResponse> {
    const deliveryperson =
      await this.deliverypersonsRepository.findById(deliveryPersonId)
    if (!deliveryperson) {
      return left(new ResourceNotFoundError())
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const deliverypersonToUpdate = DeliveryPerson.create(
      {
        name: deliveryperson.name,
        email: deliveryperson.email,
        cpf: deliveryperson.cpf,
        phoneNumber: deliveryperson.phoneNumber,
        password: hashedPassword,
      },
      deliveryperson.id,
    )
    await this.deliverypersonsRepository.save(deliverypersonToUpdate)
    return right({ deliveryperson: deliverypersonToUpdate })
  }
}

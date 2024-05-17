import { Either, left, right } from '@/core/types/either'

import { DeliveryPerson } from '../../enterprise/entities/delivery-person'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditDeliveryPersonUseCaseRequest {
  name: string
  email: string
  phoneNumber: string
  cpf: string
  password: string
}

type EditDeliveryPersonUseCaseResponse = Either<
  ResourceNotFoundError,
  { deliveryperson: DeliveryPerson }
>

export class EditDeliveryPersonUseCase {
  constructor(
    private deliverypersonsRepository: DeliveryPersonsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    cpf,
    phoneNumber,
  }: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseResponse> {
    const deliveryperson = await this.deliverypersonsRepository.findByCpf(cpf)
    if (!deliveryperson) {
      return left(new ResourceNotFoundError())
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const deliverypersonToUpdate = DeliveryPerson.create(
      {
        cpf: Cpf.createFromText(cpf),
        email,
        password: hashedPassword,
        phoneNumber,
        name,
      },
      deliveryperson.id,
    )
    await this.deliverypersonsRepository.save(deliverypersonToUpdate)
    return right({ deliveryperson: deliverypersonToUpdate })
  }
}

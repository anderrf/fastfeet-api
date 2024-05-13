import { Either, left, right } from '@/core/types/either'

import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface AuthenticateDeliveryPersonUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliveryPersonUseCaseResponse = Either<
  ResourceNotFoundError | InvalidDocumentError | InvalidCredentialsError,
  { accessToken: string }
>

export class AuthenticateDeliveryPersonUseCase {
  constructor(
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    password,
    cpf,
  }: AuthenticateDeliveryPersonUseCaseRequest): Promise<AuthenticateDeliveryPersonUseCaseResponse> {
    const validatedCpf = Cpf.createFromText(cpf)
    if (!validatedCpf.isValid()) {
      return left(new InvalidDocumentError(cpf))
    }
    const deliveryPerson = await this.deliveryPersonsRepository.findByCpf(cpf)
    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryPerson.password,
    )
    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }
    const accessToken = await this.encrypter.encrypt({
      sub: deliveryPerson.id.toString(),
    })
    return right({ accessToken })
  }
}

import { Either, left, right } from '@/core/types/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { Injectable } from '@nestjs/common'

interface AuthenticateDeliveryPersonUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliveryPersonUseCaseResponse = Either<
  InvalidCredentialsError,
  { accessToken: string }
>

@Injectable()
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
    const deliveryPerson = await this.deliveryPersonsRepository.findByCpf(cpf)
    if (!deliveryPerson) {
      return left(new InvalidCredentialsError())
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

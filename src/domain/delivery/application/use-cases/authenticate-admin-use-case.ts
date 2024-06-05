import { Either, left, right } from '@/core/types/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AdminsRepository } from '../repositories/admins-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { Injectable } from '@nestjs/common'

interface AuthenticateAdminUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  InvalidCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    password,
    cpf,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByCpf(cpf)
    if (!admin) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      admin.password,
    )
    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }
    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
    })
    return right({ accessToken })
  }
}

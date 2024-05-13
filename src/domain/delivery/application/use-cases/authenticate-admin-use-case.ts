import { Either, left, right } from '@/core/types/either'

import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AdminsRepository } from '../repositories/admins-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface AuthenticateAdminUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  ResourceNotFoundError | InvalidDocumentError | InvalidCredentialsError,
  { accessToken: string }
>

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
    const validatedCpf = Cpf.createFromText(cpf)
    if (!validatedCpf.isValid()) {
      return left(new InvalidDocumentError(cpf))
    }
    const admin = await this.adminsRepository.findByCpf(cpf)
    if (!admin) {
      return left(new ResourceNotFoundError())
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

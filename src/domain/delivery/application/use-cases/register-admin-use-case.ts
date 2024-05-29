import { Admin } from '../../enterprise/entities/admin'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { Either, left, right } from '@/core/types/either'
import { UserWithSameDocumentAlreadyExistsError } from './errors/user-with-same-document-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from './errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from './errors/user-with-same-phone-number-already-exists-error'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { Injectable } from '@nestjs/common'

interface RegisterAdminUseCaseRequest {
  name: string
  email: string
  phoneNumber: string
  cpf: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  | UserWithSameDocumentAlreadyExistsError
  | UserWithSameEmailAlreadyExistsError
  | UserWithSamePhoneNumberAlreadyExistsError
  | InvalidDocumentError,
  { admin: Admin }
>

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    cpf,
    phoneNumber,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminsRepository.findByCpf(cpf)
    if (adminWithSameCpf) {
      return left(new UserWithSameDocumentAlreadyExistsError(cpf))
    }
    const adminWithSameEmail = await this.adminsRepository.findByEmail(email)
    if (adminWithSameEmail) {
      return left(new UserWithSameEmailAlreadyExistsError(email))
    }
    const adminWithSamePhoneNumber =
      await this.adminsRepository.findByCpf(phoneNumber)
    if (adminWithSamePhoneNumber) {
      return left(new UserWithSamePhoneNumberAlreadyExistsError(phoneNumber))
    }
    const validatedCpf = Cpf.createFromText(cpf)
    if (!validatedCpf.isValid()) {
      return left(new InvalidDocumentError(cpf))
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const admin = Admin.create({
      name,
      email,
      password: hashedPassword,
      cpf: validatedCpf,
      phoneNumber,
    })
    await this.adminsRepository.create(admin)
    return right({ admin })
  }
}

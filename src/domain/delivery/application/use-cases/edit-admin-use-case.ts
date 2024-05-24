import { Either, left, right } from '@/core/types/either'

import { Admin } from '../../enterprise/entities/admin'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UserWithSameDocumentAlreadyExistsError } from './errors/user-with-same-document-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from './errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from './errors/user-with-same-phone-number-already-exists-error'
import { InvalidDocumentError } from './errors/invalid-document-error'

interface EditAdminUseCaseRequest {
  name: string
  email: string
  phoneNumber: string
  cpf: string
  password: string
  adminId: string
}

type EditAdminUseCaseResponse = Either<
  | ResourceNotFoundError
  | InvalidDocumentError
  | UserWithSameDocumentAlreadyExistsError
  | UserWithSameEmailAlreadyExistsError
  | UserWithSamePhoneNumberAlreadyExistsError,
  { admin: Admin }
>

export class EditAdminUseCase {
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
    adminId,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new ResourceNotFoundError())
    }
    const validatedCpf = Cpf.createFromText(cpf)
    if (!validatedCpf.isValid()) {
      return left(new InvalidDocumentError(cpf))
    }
    const adminWithSameCpf = await this.adminsRepository.findByCpf(cpf)
    if (adminWithSameCpf && !adminWithSameCpf?.id.equals(admin.id)) {
      return left(new UserWithSameDocumentAlreadyExistsError(cpf))
    }
    const adminWithSameEmail = await this.adminsRepository.findByEmail(email)
    if (adminWithSameEmail && !adminWithSameEmail?.id.equals(admin.id)) {
      return left(new UserWithSameEmailAlreadyExistsError(email))
    }
    const adminWithSamePhoneNumber =
      await this.adminsRepository.findByCpf(phoneNumber)
    if (
      adminWithSamePhoneNumber &&
      !adminWithSamePhoneNumber?.id.equals(admin.id)
    ) {
      return left(new UserWithSamePhoneNumberAlreadyExistsError(phoneNumber))
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const adminToUpdate = Admin.create(
      {
        cpf: validatedCpf,
        email,
        password: hashedPassword,
        phoneNumber,
        name,
      },
      admin.id,
    )
    await this.adminsRepository.save(adminToUpdate)
    return right({ admin: adminToUpdate })
  }
}

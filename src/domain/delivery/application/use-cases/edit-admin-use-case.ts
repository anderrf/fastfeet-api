import { Either, left, right } from '@/core/types/either'

import { Admin } from '../../enterprise/entities/admin'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditAdminUseCaseRequest {
  name: string
  email: string
  phoneNumber: string
  cpf: string
  password: string
}

type EditAdminUseCaseResponse = Either<ResourceNotFoundError, { admin: Admin }>

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
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByCpf(cpf)
    if (!admin) {
      return left(new ResourceNotFoundError())
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const adminToUpdate = Admin.create(
      {
        cpf: Cpf.createFromText(cpf),
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

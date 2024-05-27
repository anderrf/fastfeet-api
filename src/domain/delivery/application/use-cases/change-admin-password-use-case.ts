import { Either, left, right } from '@/core/types/either'

import { Admin } from '../../enterprise/entities/admin'
import { HashGenerator } from '../cryptography/hash-generator'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ChangeAdminPasswordUseCaseRequest {
  password: string
  adminId: string
}

type ChangeAdminPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  { admin: Admin }
>

export class ChangeAdminPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    password,
    adminId,
  }: ChangeAdminPasswordUseCaseRequest): Promise<ChangeAdminPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const adminToUpdate = Admin.create(
      {
        cpf: admin.cpf,
        email: admin.email,
        password: hashedPassword,
        phoneNumber: admin.phoneNumber,
        name: admin.name,
      },
      admin.id,
    )
    await this.adminsRepository.save(adminToUpdate)
    return right({ admin: adminToUpdate })
  }
}

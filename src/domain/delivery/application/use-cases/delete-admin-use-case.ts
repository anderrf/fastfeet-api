import { Either, left, right } from '@/core/types/either'

import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteAdminUseCaseRequest {
  cpf: string
}

type DeleteAdminUseCaseResponse = Either<
  ResourceNotFoundError,
  { admin: Admin }
>

export class DeleteAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    cpf,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByCpf(cpf)
    if (!admin) {
      return left(new ResourceNotFoundError())
    }
    await this.adminsRepository.delete(admin)
    return right({ admin })
  }
}

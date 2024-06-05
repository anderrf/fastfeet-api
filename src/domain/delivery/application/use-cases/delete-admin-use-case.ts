import { Either, left, right } from '@/core/types/either'

import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteAdminUseCaseRequest {
  adminId: string
}

type DeleteAdminUseCaseResponse = Either<
  ResourceNotFoundError,
  { admin: Admin }
>

@Injectable()
export class DeleteAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new ResourceNotFoundError())
    }
    await this.adminsRepository.delete(admin)
    return right({ admin })
  }
}

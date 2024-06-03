import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/delivery/enterprise/entities/admin'
import { faker } from '@faker-js/faker'
import { makeRandomCpf } from './make-cpf-factory'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityId,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phoneNumber: faker.phone.number(),
      cpf: makeRandomCpf(),
      ...override,
    },
    id,
  )
  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)
    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })
    return admin
  }
}

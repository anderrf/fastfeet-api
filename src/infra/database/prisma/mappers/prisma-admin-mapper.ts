import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        cpf: Cpf.createFromText(raw.cpf),
        email: raw.email,
        phoneNumber: raw.phoneNumber,
        createdAt: raw.createdAt,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf.toPlainValue(),
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      createdAt: admin.createdAt,
      password: admin.password,
    }
  }
}

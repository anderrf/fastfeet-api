import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaDeliveryPersonMapper {
  static toDomain(raw: PrismaUser): DeliveryPerson {
    return DeliveryPerson.create(
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

  static toPrisma(
    deliveryperson: DeliveryPerson,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryperson.id.toString(),
      name: deliveryperson.name,
      cpf: deliveryperson.cpf.toPlainValue(),
      email: deliveryperson.email,
      phoneNumber: deliveryperson.phoneNumber,
      createdAt: deliveryperson.createdAt,
      password: deliveryperson.password,
      role: 'DELIVERY_PERSON',
    }
  }
}

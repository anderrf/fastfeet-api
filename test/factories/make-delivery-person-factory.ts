import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  DeliveryPerson,
  DeliveryPersonProps,
} from '@/domain/delivery/enterprise/entities/delivery-person'
import { faker } from '@faker-js/faker'
import { makeRandomCpf } from './make-cpf-factory'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDeliveryPersonMapper } from '@/infra/database/prisma/mappers/prisma-delivery-person-mapper'

export function makeDeliveryPerson(
  override: Partial<DeliveryPersonProps> = {},
  id?: UniqueEntityId,
) {
  const deliveryperson = DeliveryPerson.create(
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
  return deliveryperson
}

@Injectable()
export class DeliveryPersonFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaDeliveryPerson(
    data: Partial<DeliveryPersonProps> = {},
  ): Promise<DeliveryPerson> {
    const deliveryperson = makeDeliveryPerson(data)
    await this.prisma.user.create({
      data: PrismaDeliveryPersonMapper.toPrisma(deliveryperson),
    })
    return deliveryperson
  }
}

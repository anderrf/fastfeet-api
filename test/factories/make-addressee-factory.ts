import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Addressee,
  AddresseeProps,
} from '@/domain/delivery/enterprise/entities/addressee'
import { faker } from '@faker-js/faker'

import { makeRandomRegisterDocument } from './make-register-document'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAddresseeMapper } from '@/infra/database/prisma/mappers/prisma-addressee-mapper'

export function makeAddressee(
  override: Partial<AddresseeProps> = {},
  id?: UniqueEntityId,
) {
  const addressee = Addressee.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      document: makeRandomRegisterDocument(),
      ...override,
    },
    id,
  )
  return addressee
}

@Injectable()
export class AddresseeFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaAddressee(
    data: Partial<AddresseeProps> = {},
  ): Promise<Addressee> {
    const addressee = makeAddressee(data)
    await this.prisma.addressee.create({
      data: PrismaAddresseeMapper.toPrisma(addressee),
    })
    return addressee
  }
}

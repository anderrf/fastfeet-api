import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/delivery/enterprise/entities/address'
import { ZipCode } from '@/domain/delivery/enterprise/entities/value-objects/zip-code'
import { PrismaAddressMapper } from '@/infra/database/prisma/mappers/prisma-address-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityId,
) {
  const address = Address.create(
    {
      addresseeId: new UniqueEntityId(),
      street: faker.location.street(),
      number: Number.parseInt(faker.location.buildingNumber()),
      district: faker.location.county(),
      zipCode: ZipCode.createFromText(faker.location.zipCode('#####-###')),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  )
  return address
}

@Injectable()
export class AddressFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaAddress(data: Partial<AddressProps> = {}): Promise<Address> {
    const address = makeAddress(data)
    await this.prisma.address.create({
      data: PrismaAddressMapper.toPrisma(address),
    })
    return address
  }
}

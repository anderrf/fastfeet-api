import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/delivery/enterprise/entities/address'
import { ZipCode } from '@/domain/delivery/enterprise/entities/value-objects/zip-code'
import { faker } from '@faker-js/faker'

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

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Addressee,
  AddresseeProps,
} from '@/domain/delivery/enterprise/entities/addressee'
import { faker } from '@faker-js/faker'

import { makeRandomRegisterDocument } from './make-register-document'

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

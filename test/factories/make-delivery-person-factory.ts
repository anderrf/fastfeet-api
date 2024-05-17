import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  DeliveryPerson,
  DeliveryPersonProps,
} from '@/domain/delivery/enterprise/entities/delivery-person'
import { faker } from '@faker-js/faker'
import { makeRandomCpf } from './make-cpf-factory'

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

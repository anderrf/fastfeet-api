import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Parcel,
  ParcelProps,
} from '@/domain/delivery/enterprise/entities/parcel'
import { faker } from '@faker-js/faker'

export function makeParcel(
  override: Partial<ParcelProps> = {},
  id?: UniqueEntityId,
) {
  const parcel = Parcel.create(
    {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      addressId: new UniqueEntityId(),
      addresseeId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
  return parcel
}

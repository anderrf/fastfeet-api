import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Address } from '@/domain/delivery/enterprise/entities/address'
import { ZipCode } from '@/domain/delivery/enterprise/entities/value-objects/zip-code'
import { Address as PrismaAddress, Prisma } from '@prisma/client'

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        street: raw.street,
        number: Number.parseInt(raw.number),
        district: raw.district,
        city: raw.city,
        state: raw.state,
        zipCode: ZipCode.createFromText(raw.zipCode),
        country: raw.country,
        latitude: raw.latitude,
        longitude: raw.longitude,
        addresseeId: new UniqueEntityId(raw.addresseeId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.toString(),
      street: address.street,
      number: address.number.toString(),
      district: address.district,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode.value,
      country: address.country,
      latitude: address.latitude,
      longitude: address.longitude,
      addresseeId: address.addresseeId.toString(),
    }
  }
}

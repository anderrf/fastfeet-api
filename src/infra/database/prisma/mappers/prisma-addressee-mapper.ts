import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Addressee } from '@/domain/delivery/enterprise/entities/addressee'
import { makeRegisterDocumentFromValue } from '@/domain/delivery/enterprise/entities/value-objects/register-document'
import { Addressee as PrismaAddressee, Prisma } from '@prisma/client'

export class PrismaAddresseeMapper {
  static toDomain(raw: PrismaAddressee): Addressee {
    return Addressee.create(
      {
        name: raw.name,
        document: makeRegisterDocumentFromValue(raw.document),
        email: raw.email,
        phoneNumber: raw.phoneNumber,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(addressee: Addressee): Prisma.AddresseeUncheckedCreateInput {
    return {
      id: addressee.id.toString(),
      name: addressee.name,
      document: addressee.document.toPlainValue(),
      email: addressee.email,
      phoneNumber: addressee.phoneNumber,
      createdAt: addressee.createdAt,
    }
  }
}

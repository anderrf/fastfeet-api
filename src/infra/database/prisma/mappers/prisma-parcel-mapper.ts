import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'
import { Parcel as PrismaParcel, Prisma } from '@prisma/client'

export class PrismaParcelMapper {
  static toDomain(raw: PrismaParcel): Parcel {
    return Parcel.create(
      {
        title: raw.title,
        description: raw.description,
        createdAt: raw.createdAt,
        readyAt: raw.readyAt,
        takenAt: raw.takenAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
        deliveredBy: raw.deliveredBy
          ? new UniqueEntityId(raw.deliveredBy)
          : null,
        addresseeId: new UniqueEntityId(raw.addresseeId),
        addressId: new UniqueEntityId(raw.addressId),
        attachmentId: raw.attachmentId
          ? new UniqueEntityId(raw.attachmentId)
          : null,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(parcel: Parcel): Prisma.ParcelUncheckedCreateInput {
    return {
      id: parcel.id.toString(),
      title: parcel.title,
      description: parcel.description,
      createdAt: parcel.createdAt,
      readyAt: parcel.readyAt,
      takenAt: parcel.takenAt,
      deliveredAt: parcel.deliveredAt,
      returnedAt: parcel.returnedAt,
      deliveredBy: parcel.deliveredBy?.toString(),
      addresseeId: parcel.addresseeId.toString(),
      addressId: parcel.addressId.toString(),
      attachmentId: parcel.attachmentId?.toString(),
    }
  }
}

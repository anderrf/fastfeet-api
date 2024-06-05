import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'

export class ParcelPresenter {
  static toHTTP(parcel: Parcel) {
    return {
      id: parcel.id.toString(),
      title: parcel.title,
      description: parcel.description,
      addresseeId: parcel.addresseeId.toString(),
      addressId: parcel.addressId.toString(),
      createdAt: parcel.createdAt,
      readyAt: parcel.readyAt,
      takenAt: parcel.takenAt,
      deliveredAt: parcel.deliveredAt,
      returnedAt: parcel.returnedAt,
      deliveredBy: parcel.deliveredBy?.toString(),
    }
  }
}

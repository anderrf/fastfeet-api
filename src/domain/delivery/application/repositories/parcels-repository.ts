import { Parcel } from '../../enterprise/entities/parcel'

export abstract class ParcelsRepository {
  abstract create(parcel: Parcel): Promise<void>
  abstract save(parcel: Parcel): Promise<void>
  abstract delete(parcel: Parcel): Promise<void>
  abstract findById(id: string): Promise<Parcel | null>
  abstract findManyByAddresseeId(addresseeId: string): Promise<Parcel[]>
  abstract findManyByAddressId(addressId: string): Promise<Parcel[]>
}

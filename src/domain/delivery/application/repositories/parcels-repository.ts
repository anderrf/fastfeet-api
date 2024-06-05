import { Parcel, ParcelStatus } from '../../enterprise/entities/parcel'
import { Coordinate } from '../use-cases/utils/get-distance-between-coordinates'

export abstract class ParcelsRepository {
  abstract create(parcel: Parcel): Promise<void>
  abstract save(parcel: Parcel): Promise<void>
  abstract delete(parcel: Parcel): Promise<void>
  abstract findById(id: string): Promise<Parcel | null>
  abstract findManyByAddresseeId(addresseeId: string): Promise<Parcel[]>
  abstract findManyByAddressId(addressId: string): Promise<Parcel[]>
  abstract findManyAvailable(): Promise<Parcel[]>
  abstract findManyByStatus(status: ParcelStatus): Promise<Parcel[]>
  abstract findManyByDeliveryPersonId(
    deliveryPersonId: string,
  ): Promise<Parcel[]>

  abstract findManyNearbyDeliveryPerson(
    deliveryPersonId: string,
    coordinates: Coordinate,
  ): Promise<Parcel[]>
}

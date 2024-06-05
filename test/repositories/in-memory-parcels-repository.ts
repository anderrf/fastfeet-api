import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import {
  Coordinate,
  getDistanceBetweenCoordinates,
} from '@/domain/delivery/application/use-cases/utils/get-distance-between-coordinates'
import {
  Parcel,
  ParcelStatus,
} from '@/domain/delivery/enterprise/entities/parcel'
import { InMemoryAddressesRepository } from './in-memory-addresses-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryParcelsRepository implements ParcelsRepository {
  constructor(
    private addressesRepository: InMemoryAddressesRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  public items: Parcel[] = []

  async create(parcel: Parcel): Promise<void> {
    this.items.push(parcel)
  }

  async save(parcel: Parcel): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(parcel.id))
    this.items[itemIndex] = parcel
    DomainEvents.dispatchEventsForAggregate(parcel.id)
  }

  async delete(parcel: Parcel): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(parcel.id))
    this.items.splice(itemIndex, 1)
    if (parcel.attachmentId) {
      const attachment = await this.attachmentsRepository.findById(
        parcel.attachmentId.toString(),
      )
      if (attachment) {
        await this.attachmentsRepository.delete(attachment)
      }
    }
  }

  async findById(id: string): Promise<Parcel | null> {
    const parcel = this.items.find((parcel) => parcel.id.toString() === id)
    return parcel ?? null
  }

  async findManyByAddresseeId(addresseeId: string): Promise<Parcel[]> {
    const parcels = this.items.filter(
      (item) => item.addresseeId.toString() === addresseeId,
    )
    return parcels
  }

  async findManyByAddressId(addressId: string): Promise<Parcel[]> {
    const parcels = this.items.filter(
      (item) => item.addressId.toString() === addressId,
    )
    return parcels
  }

  async findManyAvailable(): Promise<Parcel[]> {
    const parcels = this.items.filter(
      (item) => item.status === ParcelStatus.READY,
    )
    return parcels
  }

  async findManyByStatus(status: ParcelStatus): Promise<Parcel[]> {
    if (!ParcelStatus[status]) {
      throw new Error()
    }
    const parcels = this.items.filter((item) => item.status === status)
    return parcels
  }

  async findManyByDeliveryPersonId(
    deliveryPersonId: string,
  ): Promise<Parcel[]> {
    const parcels = this.items.filter(
      (item) => item.deliveredBy?.toString() === deliveryPersonId,
    )
    return parcels
  }

  async findManyNearbyDeliveryPerson(
    deliveryPersonId: string,
    coordinates: Coordinate,
  ): Promise<Parcel[]> {
    const MAX_DISTANCE_FOR_PACKAGES_IN_KILOMETERS = 10
    const nearbyParcels: Parcel[] = []
    for (const item of this.items) {
      const address = await this.addressesRepository.findById(
        item.addressId.toString(),
      )
      if (!address) {
        throw new Error()
      }
      const distance = getDistanceBetweenCoordinates(
        { latitude: coordinates.latitude, longitude: coordinates.longitude },
        { latitude: address.latitude, longitude: address.longitude },
      )
      if (distance <= MAX_DISTANCE_FOR_PACKAGES_IN_KILOMETERS) {
        nearbyParcels.push(item)
      }
    }
    const parcels = nearbyParcels.filter((nearbyParcel) => {
      if (!nearbyParcel.deliveredBy) {
        return nearbyParcel.status === ParcelStatus.READY
      }
      if (nearbyParcel.deliveredBy.toString() !== deliveryPersonId) {
        return false
      }
      return nearbyParcel.status !== ParcelStatus.RETURNED
    })
    return parcels
  }
}

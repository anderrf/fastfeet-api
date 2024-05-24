import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { Parcel } from '@/domain/delivery/enterprise/entities/parcel'

export class InMemoryParcelsRepository implements ParcelsRepository {
  public items: Parcel[] = []

  async create(parcel: Parcel): Promise<void> {
    this.items.push(parcel)
  }

  async save(parcel: Parcel): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(parcel.id))
    this.items[itemIndex] = parcel
  }

  async delete(parcel: Parcel): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(parcel.id))
    this.items.splice(itemIndex, 1)
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
}

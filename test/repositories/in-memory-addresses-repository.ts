import { AddressesRepository } from '@/domain/delivery/application/repositories/addresses-repository'
import { Address } from '@/domain/delivery/enterprise/entities/address'

export class InMemoryAddressesRepository implements AddressesRepository {
  public items: Address[] = []

  async create(address: Address): Promise<void> {
    this.items.push(address)
  }

  async save(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(address.id))
    this.items[itemIndex] = address
  }

  async delete(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(address.id))
    this.items.splice(itemIndex, 1)
  }

  async findById(id: string): Promise<Address | null> {
    const address = this.items.find((item) => item.id.toString() === id)
    return address ?? null
  }

  async findManyByAddresseeId(addresseeId: string): Promise<Address[]> {
    const addresses = this.items.filter(
      (item) => item.addresseeId.toString() === addresseeId,
    )
    return addresses
  }

  async deleteManyByAddresseeId(addresseeId: string): Promise<void> {
    const addresses = this.items.filter(
      (item) => item.addresseeId.toString() !== addresseeId,
    )
    this.items = addresses
  }
}

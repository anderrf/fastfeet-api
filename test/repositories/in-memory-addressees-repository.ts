import { AddresseesRepository } from '@/domain/delivery/application/repositories/addressees-repository'
import { Addressee } from '@/domain/delivery/enterprise/entities/addressee'
import { InMemoryAddressesRepository } from './in-memory-addresses-repository'

export class InMemoryAddresseesRepository implements AddresseesRepository {
  public items: Addressee[] = []

  constructor(private addressesRepository: InMemoryAddressesRepository) {}

  async create(addressee: Addressee): Promise<void> {
    this.items.push(addressee)
  }

  async save(addressee: Addressee): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(addressee.id),
    )
    this.items[itemIndex] = addressee
  }

  async delete(addressee: Addressee): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(addressee.id),
    )
    this.items.splice(itemIndex, 1)
    await this.addressesRepository.deleteManyByAddresseeId(
      addressee.id.toString(),
    )
  }

  async findById(id: string): Promise<Addressee | null> {
    const addressee = this.items.find((item) => item.id.toString() === id)
    return addressee ?? null
  }

  async findByEmail(email: string): Promise<Addressee | null> {
    const addressee = this.items.find((item) => item.email === email)
    return addressee ?? null
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Addressee | null> {
    const addressee = this.items.find(
      (item) => item.phoneNumber === phoneNumber,
    )
    return addressee ?? null
  }

  async findByDocument(document: string): Promise<Addressee | null> {
    const addressee = this.items.find(
      (item) => item.document.toPlainValue() === document,
    )
    return addressee ?? null
  }
}

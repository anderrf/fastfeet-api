import { Address } from '../../enterprise/entities/address'

export abstract class AddressesRepository {
  abstract create(address: Address): Promise<void>
  abstract save(address: Address): Promise<void>
  abstract delete(address: Address): Promise<void>
  abstract findById(id: string): Promise<Address | null>
  abstract findManyByAddresseeId(addresseeId: string): Promise<Address[]>
  abstract deleteManyByAddresseeId(addresseeId: string): Promise<void>
}

import { Addressee } from '../../enterprise/entities/addressee'

export abstract class AddresseesRepository {
  abstract create(addressee: Addressee): Promise<void>
  abstract save(addressee: Addressee): Promise<void>
  abstract delete(addressee: Addressee): Promise<void>
  abstract findById(id: string): Promise<Addressee | null>
  abstract findByEmail(email: string): Promise<Addressee | null>
  abstract findByPhoneNumber(phoneNumber: string): Promise<Addressee | null>
  abstract findByDocument(document: string): Promise<Addressee | null>
}

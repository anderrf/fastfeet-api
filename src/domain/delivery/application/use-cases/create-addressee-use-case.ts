import { Either, left, right } from '@/core/types/either'

import { Addressee } from '../../enterprise/entities/addressee'
import { makeRegisterDocumentFromValue } from '../../enterprise/entities/value-objects/register-document'
import { AddresseesRepository } from '../repositories/addressees-repository'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { UserWithSameDocumentAlreadyExistsError } from './errors/user-with-same-document-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from './errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from './errors/user-with-same-phone-number-already-exists-error'

interface CreateAddresseeUseCaseRequest {
  name: string
  email: string
  phoneNumber: string
  document: string
}

type CreateAddresseeUseCaseResponse = Either<
  | UserWithSameDocumentAlreadyExistsError
  | UserWithSameEmailAlreadyExistsError
  | UserWithSamePhoneNumberAlreadyExistsError
  | InvalidDocumentError,
  { addressee: Addressee }
>

export class CreateAddresseeUseCase {
  constructor(private addresseesRepository: AddresseesRepository) {}

  async execute({
    name,
    email,
    document,
    phoneNumber,
  }: CreateAddresseeUseCaseRequest): Promise<CreateAddresseeUseCaseResponse> {
    const addresseeWithSameDocument =
      await this.addresseesRepository.findByDocument(document)
    if (addresseeWithSameDocument) {
      return left(new UserWithSameDocumentAlreadyExistsError(document))
    }
    const addresseeWithSameEmail =
      await this.addresseesRepository.findByEmail(email)
    if (addresseeWithSameEmail) {
      return left(new UserWithSameEmailAlreadyExistsError(email))
    }
    const addresseeWithSamePhoneNumber =
      await this.addresseesRepository.findByPhoneNumber(phoneNumber)
    if (addresseeWithSamePhoneNumber) {
      return left(new UserWithSamePhoneNumberAlreadyExistsError(email))
    }
    const validatedDocument = makeRegisterDocumentFromValue(document)
    if (!validatedDocument.isValid()) {
      return left(new InvalidDocumentError(email))
    }
    const addressee = Addressee.create({
      name,
      email,
      document: validatedDocument,
      phoneNumber,
    })
    await this.addresseesRepository.create(addressee)
    return right({ addressee })
  }
}

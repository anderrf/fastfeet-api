import { Either, left, right } from '@/core/types/either'

import { Addressee } from '../../enterprise/entities/addressee'
import { makeRegisterDocumentFromValue } from '../../enterprise/entities/value-objects/register-document'
import { AddresseesRepository } from '../repositories/addressees-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UserWithSameDocumentAlreadyExistsError } from './errors/user-with-same-document-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from './errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from './errors/user-with-same-phone-number-already-exists-error'
import { InvalidDocumentError } from './errors/invalid-document-error'

interface EditAddresseeUseCaseRequest {
  name: string
  email: string
  phoneNumber: string
  document: string
  addresseeId: string
}

type EditAddresseeUseCaseResponse = Either<
  | ResourceNotFoundError
  | InvalidDocumentError
  | UserWithSameDocumentAlreadyExistsError
  | UserWithSameEmailAlreadyExistsError
  | UserWithSamePhoneNumberAlreadyExistsError,
  { addressee: Addressee }
>

export class EditAddresseeUseCase {
  constructor(private addresseesRepository: AddresseesRepository) {}

  async execute({
    name,
    email,
    document,
    phoneNumber,
    addresseeId,
  }: EditAddresseeUseCaseRequest): Promise<EditAddresseeUseCaseResponse> {
    const addressee = await this.addresseesRepository.findById(addresseeId)
    if (!addressee) {
      return left(new ResourceNotFoundError())
    }
    const validatedDocument = makeRegisterDocumentFromValue(document)
    if (!validatedDocument.isValid()) {
      return left(new InvalidDocumentError(email))
    }
    const addresseeWithSameDocument =
      await this.addresseesRepository.findByDocument(document)
    if (
      addresseeWithSameDocument &&
      !addresseeWithSameDocument?.id.equals(addressee.id)
    ) {
      return left(new UserWithSameDocumentAlreadyExistsError(document))
    }
    const addresseeWithSameEmail =
      await this.addresseesRepository.findByEmail(email)
    if (
      addresseeWithSameEmail &&
      !addresseeWithSameEmail?.id.equals(addressee.id)
    ) {
      return left(new UserWithSameEmailAlreadyExistsError(email))
    }
    const addresseeWithSamePhoneNumber =
      await this.addresseesRepository.findByPhoneNumber(phoneNumber)
    if (
      addresseeWithSamePhoneNumber &&
      !addresseeWithSamePhoneNumber?.id.equals(addressee.id)
    ) {
      return left(new UserWithSamePhoneNumberAlreadyExistsError(phoneNumber))
    }
    const addresseeToUpdate = Addressee.create(
      {
        document: validatedDocument,
        email,
        phoneNumber,
        name,
      },
      addressee.id,
    )
    await this.addresseesRepository.save(addresseeToUpdate)
    return right({ addressee: addresseeToUpdate })
  }
}

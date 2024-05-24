import { Either, left, right } from '@/core/types/either'

import { DeliveryPerson } from '../../enterprise/entities/delivery-person'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UserWithSameEmailAlreadyExistsError } from './errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from './errors/user-with-same-phone-number-already-exists-error'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { UserWithSameDocumentAlreadyExistsError } from './errors/user-with-same-document-already-exists-error'

interface EditDeliveryPersonUseCaseRequest {
  name: string
  email: string
  phoneNumber: string
  cpf: string
  password: string
  deliveryPersonId: string
}

type EditDeliveryPersonUseCaseResponse = Either<
  | ResourceNotFoundError
  | InvalidDocumentError
  | UserWithSameDocumentAlreadyExistsError
  | UserWithSameEmailAlreadyExistsError
  | UserWithSamePhoneNumberAlreadyExistsError,
  { deliveryperson: DeliveryPerson }
>

export class EditDeliveryPersonUseCase {
  constructor(
    private deliverypersonsRepository: DeliveryPersonsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    cpf,
    phoneNumber,
    deliveryPersonId,
  }: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseResponse> {
    const deliveryperson =
      await this.deliverypersonsRepository.findById(deliveryPersonId)
    if (!deliveryperson) {
      return left(new ResourceNotFoundError())
    }
    const validatedCpf = Cpf.createFromText(cpf)
    if (!validatedCpf.isValid()) {
      return left(new InvalidDocumentError(email))
    }
    const deliverypersonWithSameCpf =
      await this.deliverypersonsRepository.findByCpf(cpf)
    if (
      deliverypersonWithSameCpf &&
      !deliverypersonWithSameCpf?.id.equals(deliveryperson.id)
    ) {
      return left(new UserWithSameDocumentAlreadyExistsError(cpf))
    }
    const deliverypersonWithSameEmail =
      await this.deliverypersonsRepository.findByEmail(email)
    if (
      deliverypersonWithSameEmail &&
      !deliverypersonWithSameEmail?.id.equals(deliveryperson.id)
    ) {
      return left(new UserWithSameEmailAlreadyExistsError(email))
    }
    const deliverypersonWithSamePhoneNumber =
      await this.deliverypersonsRepository.findByPhoneNumber(phoneNumber)
    if (
      deliverypersonWithSamePhoneNumber &&
      !deliverypersonWithSamePhoneNumber?.id.equals(deliveryperson.id)
    ) {
      return left(new UserWithSamePhoneNumberAlreadyExistsError(phoneNumber))
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const deliverypersonToUpdate = DeliveryPerson.create(
      {
        cpf: Cpf.createFromText(cpf),
        email,
        password: hashedPassword,
        phoneNumber,
        name,
      },
      deliveryperson.id,
    )
    await this.deliverypersonsRepository.save(deliverypersonToUpdate)
    return right({ deliveryperson: deliverypersonToUpdate })
  }
}

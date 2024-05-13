import { DeliveryPerson } from '../../enterprise/entities/delivery-person'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { Either, left, right } from '@/core/types/either'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from './errors/user-with-same-phone-number-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from './errors/user-with-same-email-already-exists-error'
import { UserWithSameDocumentAlreadyExistsError } from './errors/user-with-same-document-already-exists-error'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'

interface RegisterDeliveryPersonUseCaseRequest {
  name: string
  email: string
  phoneNumber: string
  cpf: string
  password: string
}

type RegisterDeliveryPersonUseCaseResponse = Either<
  | UserWithSameDocumentAlreadyExistsError
  | UserWithSameEmailAlreadyExistsError
  | UserWithSamePhoneNumberAlreadyExistsError
  | InvalidDocumentError,
  { deliveryperson: DeliveryPerson }
>

export class RegisterDeliveryPersonUseCase {
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
  }: RegisterDeliveryPersonUseCaseRequest): Promise<RegisterDeliveryPersonUseCaseResponse> {
    const deliverypersonWithSameCpf =
      await this.deliverypersonsRepository.findByCpf(cpf)
    if (deliverypersonWithSameCpf) {
      return left(new UserWithSameDocumentAlreadyExistsError(cpf))
    }
    const deliverypersonWithSameEmail =
      await this.deliverypersonsRepository.findByEmail(email)
    if (deliverypersonWithSameEmail) {
      return left(new UserWithSameEmailAlreadyExistsError(email))
    }
    const deliverypersonWithSamePhoneNumber =
      await this.deliverypersonsRepository.findByPhoneNumber(phoneNumber)
    if (deliverypersonWithSamePhoneNumber) {
      return left(new UserWithSamePhoneNumberAlreadyExistsError(email))
    }
    const validatedCpf = Cpf.createFromText(cpf)
    if (!validatedCpf.isValid()) {
      return left(new InvalidDocumentError(email))
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const deliveryperson = DeliveryPerson.create({
      name,
      email,
      password: hashedPassword,
      cpf: validatedCpf,
      phoneNumber,
    })
    await this.deliverypersonsRepository.create(deliveryperson)
    return right({ deliveryperson })
  }
}

import { DeliveryPerson } from '../../enterprise/entities/delivery-person'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { HashGenerator } from '../cryptography/hash-generator'
import { Either, left, right } from '@/core/types/either'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from './errors/user-with-same-phone-number-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from './errors/user-with-same-email-already-exists-error'
import { UserWithSameDocumentAlreadyExistsError } from './errors/user-with-same-document-already-exists-error'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class RegisterDeliveryPersonUseCase {
  constructor(
    private deliveryPersonsRepository: DeliveryPersonsRepository,
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
      await this.deliveryPersonsRepository.findByCpf(cpf)
    if (deliverypersonWithSameCpf) {
      return left(new UserWithSameDocumentAlreadyExistsError(cpf))
    }
    const deliverypersonWithSameEmail =
      await this.deliveryPersonsRepository.findByEmail(email)
    if (deliverypersonWithSameEmail) {
      return left(new UserWithSameEmailAlreadyExistsError(email))
    }
    const deliverypersonWithSamePhoneNumber =
      await this.deliveryPersonsRepository.findByPhoneNumber(phoneNumber)
    if (deliverypersonWithSamePhoneNumber) {
      return left(new UserWithSamePhoneNumberAlreadyExistsError(phoneNumber))
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
    await this.deliveryPersonsRepository.create(deliveryperson)
    return right({ deliveryperson })
  }
}

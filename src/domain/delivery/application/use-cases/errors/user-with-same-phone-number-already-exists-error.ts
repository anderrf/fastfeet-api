import { UseCaseError } from '@/domain/delivery/enterprise/errors/use-case-error'

export class UserWithSamePhoneNumberAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(phoneNumber: string) {
    super(`User with phone number "${phoneNumber}" already exists`)
  }
}

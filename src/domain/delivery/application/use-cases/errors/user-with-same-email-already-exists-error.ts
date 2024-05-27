import { UseCaseError } from '@/core/errors/use-case-error'

export class UserWithSameEmailAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(email: string) {
    super(`User with e-mail "${email}" already exists`)
  }
}

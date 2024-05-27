import { UseCaseError } from '@/core/errors/use-case-error'

export class UserWithSameDocumentAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(document: string) {
    super(`User with document "${document}" already exists`)
  }
}

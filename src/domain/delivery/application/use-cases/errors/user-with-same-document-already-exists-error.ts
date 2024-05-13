import { UseCaseError } from '@/domain/delivery/enterprise/errors/use-case-error'

export class UserWithSameDocumentAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(document: string) {
    super(`User with document "${document}" already exists`)
  }
}

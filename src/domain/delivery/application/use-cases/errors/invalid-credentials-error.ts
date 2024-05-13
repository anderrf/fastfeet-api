import { UseCaseError } from '@/domain/delivery/enterprise/errors/use-case-error'

export class InvalidCredentialsError extends Error implements UseCaseError {
  constructor() {
    super()
  }
}

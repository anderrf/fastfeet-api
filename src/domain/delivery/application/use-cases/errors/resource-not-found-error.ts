import { UseCaseError } from '@/domain/delivery/enterprise/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`ResourceNotFound`)
  }
}

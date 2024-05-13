import { UseCaseError } from '@/domain/delivery/enterprise/errors/use-case-error'

export class InvalidDocumentError extends Error implements UseCaseError {
  constructor(document: string) {
    super(`Document "${document}" is invalid`)
  }
}

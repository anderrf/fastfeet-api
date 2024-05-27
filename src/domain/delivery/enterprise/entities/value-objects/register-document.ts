import { InvalidDocumentError } from '@/domain/delivery/application/use-cases/errors/invalid-document-error'
import { Cnpj } from './cnpj'
import { Cpf } from './cpf'

export abstract class RegisterDocument {
  abstract isValid(): boolean
  abstract toPlainValue(): string
  abstract toMaskedValue(): string
}

export function makeRegisterDocumentFromValue(value: string): RegisterDocument {
  const plainValue = value
    .replaceAll('.', '')
    .replaceAll('/', '')
    .replaceAll('-', '')
  if (plainValue.length === 11) {
    return Cpf.createFromText(plainValue)
  }
  if (plainValue.length === 14) {
    return Cnpj.createFromText(plainValue)
  }
  throw new InvalidDocumentError(value)
}

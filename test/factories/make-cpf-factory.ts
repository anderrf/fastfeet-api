import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'

export function makeRandomCpf() {
  const randomDigits = `${faker.number.int({ min: 1, max: 999 }).toString().padStart(3, '0')}.${faker.number.int({ min: 1, max: 999 }).toString().padStart(3, '0')}.${faker.number.int({ min: 1, max: 999 }).toString().padStart(3, '0')}`
  const randomCpf = `${randomDigits}-${Cpf.getValidationDigits(randomDigits)}`
  return Cpf.create(randomCpf)
}

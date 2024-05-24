import { Cnpj } from '@/domain/delivery/enterprise/entities/value-objects/cnpj'
import { faker } from '@faker-js/faker'

export function makeRandomCnpj() {
  const randomDigits = `${faker.number.int({ min: 1, max: 99 }).toString().padStart(2, '0')}.${faker.number.int({ min: 1, max: 999 }).toString().padStart(3, '0')}.${faker.number.int({ min: 1, max: 999 }).toString().padStart(3, '0')}/${faker.number.int({ min: 1, max: 9999 }).toString().padStart(4, '0')}`
  const randomCnpj = `${randomDigits}-${Cnpj.getValidationDigits(randomDigits)}`
  return Cnpj.create(randomCnpj)
}

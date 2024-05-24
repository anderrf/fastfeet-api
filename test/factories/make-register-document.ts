import { faker } from '@faker-js/faker'
import { makeRandomCnpj } from './make-cnpj-factory'
import { makeRandomCpf } from './make-cpf-factory'

export function makeRandomRegisterDocument() {
  const document =
    faker.number.int({ min: 1, max: 2 }) % 2 === 0
      ? makeRandomCpf
      : makeRandomCnpj
  return document()
}

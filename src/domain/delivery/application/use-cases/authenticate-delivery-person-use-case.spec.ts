import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'

import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { FakeHasher } from './../../../../../test/cryptography/fake-hasher'
import { AuthenticateDeliveryPersonUseCase } from './authenticate-delivery-person-use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateDeliveryPersonUseCase

describe('Authenticate Student Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateDeliveryPersonUseCase(
      inMemoryDeliveryPersonsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeDeliveryPerson({
      cpf: Cpf.createFromText('654.039.990-19'),
      password: await fakeHasher.hash('123456'),
    })
    await inMemoryDeliveryPersonsRepository.create(student)
    const result = await sut.execute({
      cpf: '654.039.990-19',
      password: '123456',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate a student with wrong CPF', async () => {
    const student = makeDeliveryPerson({
      cpf: Cpf.createFromText('654.039.990-19'),
      password: await fakeHasher.hash('123456'),
    })
    await inMemoryDeliveryPersonsRepository.create(student)
    const result = await sut.execute({
      cpf: '654.039.990-29',
      password: '123456',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate a student with wrong password', async () => {
    const student = makeDeliveryPerson({
      cpf: Cpf.createFromText('654.039.990-19'),
      password: await fakeHasher.hash('123456'),
    })
    await inMemoryDeliveryPersonsRepository.create(student)
    const result = await sut.execute({
      cpf: '654.039.990-29',
      password: '123457',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})

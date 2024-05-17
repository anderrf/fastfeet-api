import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeAdmin } from 'test/factories/make-admin-factory'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'

import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { FakeHasher } from './../../../../../test/cryptography/fake-hasher'
import { AuthenticateAdminUseCase } from './authenticate-admin-use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateAdminUseCase

describe('Authenticate Student Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeAdmin({
      cpf: Cpf.createFromText('654.039.990-19'),
      password: await fakeHasher.hash('123456'),
    })
    await inMemoryAdminsRepository.create(student)
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
    const student = makeAdmin({
      cpf: Cpf.createFromText('654.039.990-19'),
      password: await fakeHasher.hash('123456'),
    })
    await inMemoryAdminsRepository.create(student)
    const result = await sut.execute({
      cpf: '654.039.990-29',
      password: '123456',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate a student with wrong password', async () => {
    const student = makeAdmin({
      cpf: Cpf.createFromText('654.039.990-19'),
      password: await fakeHasher.hash('123456'),
    })
    await inMemoryAdminsRepository.create(student)
    const result = await sut.execute({
      cpf: '654.039.990-29',
      password: '123457',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})

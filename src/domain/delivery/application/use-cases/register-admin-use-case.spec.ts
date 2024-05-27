import { FakeHasher } from './../../../../../test/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { RegisterAdminUseCase } from './register-admin-use-case'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: RegisterAdminUseCase

describe('Register Admin Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to register an admin', async () => {
    const result = await sut.execute({
      name: 'Anderson Farias',
      cpf: '654.039.990-19',
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({ admin: inMemoryAdminsRepository.items[0] }),
    )
  })

  it('should hash password on register', async () => {
    const result = await sut.execute({
      name: 'Anderson Farias',
      cpf: '654.039.990-19',
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    const hashedPassword = await fakeHasher.hash('anderson@123')
    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].password).toEqual(hashedPassword)
  })
})

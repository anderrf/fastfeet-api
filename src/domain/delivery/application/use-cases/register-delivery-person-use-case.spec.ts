import { FakeHasher } from './../../../../../test/cryptography/fake-hasher'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { RegisterDeliveryPersonUseCase } from './register-delivery-person-use-case'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher
let sut: RegisterDeliveryPersonUseCase

describe('Register Delivery Person Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterDeliveryPersonUseCase(
      inMemoryDeliveryPersonsRepository,
      fakeHasher,
    )
  })

  it('should be able to register a delivery person', async () => {
    const result = await sut.execute({
      name: 'Anderson Farias',
      cpf: '654.039.990-19',
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        deliveryperson: inMemoryDeliveryPersonsRepository.items[0],
      }),
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
    expect(inMemoryDeliveryPersonsRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})

import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'

import { FakeHasher } from '../../../../../test/cryptography/fake-hasher'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { ChangeDeliveryPersonPasswordUseCase } from './change-delivery-person-password-use-case'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher
let sut: ChangeDeliveryPersonPasswordUseCase

describe('Cange DeliveryPerson Password Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeDeliveryPersonPasswordUseCase(
      inMemoryDeliveryPersonsRepository,
      fakeHasher,
    )
  })

  it(`should be able to change an delivery person's pasword`, async () => {
    const deliveryPerson = makeDeliveryPerson({
      name: 'Anderson Farias',
      cpf: Cpf.createFromText('654.039.990-19'),
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    await inMemoryDeliveryPersonsRepository.create(deliveryPerson)
    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      password: 'anderson@321',
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryPersonsRepository.items[0].password).toEqual(
      await fakeHasher.hash('anderson@321'),
    )
  })
})

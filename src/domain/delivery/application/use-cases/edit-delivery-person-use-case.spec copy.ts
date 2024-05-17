import { FakeHasher } from './../../../../../test/cryptography/fake-hasher'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { EditDeliveryPersonUseCase } from './edit-delivery-person-use-case'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher
let sut: EditDeliveryPersonUseCase

describe('Edit Delivery Person Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()
    sut = new EditDeliveryPersonUseCase(
      inMemoryDeliveryPersonsRepository,
      fakeHasher,
    )
  })

  it('should be able to edit a delivery person', async () => {
    const deliveryperson = makeDeliveryPerson({
      name: 'Anderson Farias',
      cpf: Cpf.createFromText('654.039.990-19'),
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    await inMemoryDeliveryPersonsRepository.create(deliveryperson)
    const result = await sut.execute({
      name: 'Anderson Rocha',
      cpf: '654.039.990-19',
      email: 'anderson@teste.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        deliveryperson: expect.objectContaining({
          name: 'Anderson Rocha',
          email: 'anderson@teste.com',
        }),
      }),
    )
  })
})

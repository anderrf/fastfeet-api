import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'

import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { DeleteDeliveryPersonUseCase } from './delete-delivery-person-use-case'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let sut: DeleteDeliveryPersonUseCase

describe('Delete Delivery Person Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    sut = new DeleteDeliveryPersonUseCase(inMemoryDeliveryPersonsRepository)
  })

  it('should be able to delete a delivery person', async () => {
    const deliveryperson = makeDeliveryPerson({
      name: 'Anderson Farias',
      cpf: Cpf.createFromText('654.039.990-19'),
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    await inMemoryDeliveryPersonsRepository.create(deliveryperson)
    const result = await sut.execute({
      deliveryPersonId: '654.039.990-19',
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryPersonsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a nonexistent delivery person', async () => {
    const result = await sut.execute({
      deliveryPersonId: '654.039.990-19',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

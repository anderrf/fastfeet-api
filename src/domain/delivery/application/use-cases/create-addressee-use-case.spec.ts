import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { CreateAddresseeUseCase } from './create-addressee-use-case'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: CreateAddresseeUseCase

describe('Create Addressee Use Case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    sut = new CreateAddresseeUseCase(inMemoryAddresseesRepository)
  })

  it('should be able to create an addressee', async () => {
    const result = await sut.execute({
      name: 'Anderson Farias',
      document: '654.039.990-19',
      email: 'anderson@test.com',
      phoneNumber: '551399998888',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        addressee: inMemoryAddresseesRepository.items[0],
      }),
    )
  })
})

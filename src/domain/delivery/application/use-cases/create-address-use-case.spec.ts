import { makeAddressee } from 'test/factories/make-addressee-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { CreateAddressUseCase } from './create-address-use-case'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: CreateAddressUseCase

describe('Create Address Use Case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    sut = new CreateAddressUseCase(
      inMemoryAddressesRepository,
      inMemoryAddresseesRepository,
    )
  })

  it('should be able to create an address', async () => {
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const result = await sut.execute({
      addresseeId: addressee.id.toString(),
      street: 'Avenida São Paulo',
      number: 1000,
      district: 'Centro',
      city: 'Mongaguá',
      state: 'São Paulo',
      country: 'Brasil',
      zipCode: '11730-000',
      latitude: -45,
      longitude: -100,
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryAddressesRepository.items[0]).toEqual(
      expect.objectContaining({
        district: 'Centro',
        city: 'Mongaguá',
        state: 'São Paulo',
      }),
    )
  })
})

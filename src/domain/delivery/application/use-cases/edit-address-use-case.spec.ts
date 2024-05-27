import { makeAddress } from 'test/factories/make-address-factory'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { EditAddressUseCase } from './edit-address-use-case'
import { ZipCode } from '../../enterprise/entities/value-objects/zip-code'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let sut: EditAddressUseCase

describe('Edit Address Use Case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    sut = new EditAddressUseCase(inMemoryAddressesRepository)
  })

  it('should be able to edit an address', async () => {
    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)
    const result = await sut.execute({
      street: 'Avenida São Paulo',
      number: 1020,
      district: 'Centro',
      city: 'Mongaguá',
      state: 'São Paulo',
      country: 'Brasil',
      zipCode: '11730-010',
      latitude: -50,
      longitude: -110,
      addressId: address.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryAddressesRepository.items[0]).toEqual(
      expect.objectContaining({
        number: 1020,
        zipCode: ZipCode.createFromText('11730-010'),
        latitude: -50,
        longitude: -110,
      }),
    )
  })
})

import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { CreateParcelUseCase } from './create-parcel-use-case'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { makeAddress } from 'test/factories/make-address-factory'

let inMemoryParcelsRepository: InMemoryParcelsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: CreateParcelUseCase

describe('Create Parcel Use Case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryParcelsRepository = new InMemoryParcelsRepository()
    sut = new CreateParcelUseCase(
      inMemoryAddressesRepository,
      inMemoryAddresseesRepository,
      inMemoryParcelsRepository,
    )
  })

  it('should be able to create a parcel', async () => {
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const address = makeAddress({ addresseeId: addressee.id })
    await inMemoryAddressesRepository.create(address)
    const result = await sut.execute({
      title: 'Parcel title',
      description: 'Parcel description',
      addresseeId: addressee.id.toString(),
      addressId: address.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        parcel: inMemoryParcelsRepository.items[0],
      }),
    )
  })
})

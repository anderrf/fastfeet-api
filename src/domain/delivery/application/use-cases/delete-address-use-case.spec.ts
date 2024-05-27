import { makeAddress } from 'test/factories/make-address-factory'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { DeleteAddressUseCase } from './delete-address-use-case'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: DeleteAddressUseCase

describe('Delete Addressee Use Case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    sut = new DeleteAddressUseCase(inMemoryAddressesRepository)
  })

  it('should be able to delete an address', async () => {
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const address = makeAddress({ addresseeId: addressee.id })
    await inMemoryAddressesRepository.create(address)
    const result = await sut.execute({
      addressId: address.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryAddressesRepository.items).toHaveLength(0)
  })
})

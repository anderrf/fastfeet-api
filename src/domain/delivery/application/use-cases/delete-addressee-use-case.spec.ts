import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { DeleteAddresseeUseCase } from './delete-addressee-use-case'
import { makeAddressee } from 'test/factories/make-addressee-factory'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: DeleteAddresseeUseCase

describe('Delete Addressee Use Case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    sut = new DeleteAddresseeUseCase(inMemoryAddresseesRepository)
  })

  it('should be able to delete an addressee', async () => {
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const result = await sut.execute({
      addresseeId: addressee.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryAddresseesRepository.items).toHaveLength(0)
  })
})

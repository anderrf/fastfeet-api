import { makeAddressee } from 'test/factories/make-addressee-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { EditAddresseeUseCase } from './edit-addressee-use-case'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: EditAddresseeUseCase

describe('Edit Addressee Use Case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    sut = new EditAddresseeUseCase(inMemoryAddresseesRepository)
  })

  it('should be able to edit an addressee', async () => {
    const addressee = makeAddressee({
      name: 'Anderson Farias',
      document: Cpf.createFromText('654.039.990-19'),
      email: 'anderson@test.com',
      phoneNumber: '551399998888',
    })
    await inMemoryAddresseesRepository.create(addressee)
    const result = await sut.execute({
      name: 'Anderson Rocha',
      document: '654.039.990-19',
      email: 'anderson@teste.com',
      phoneNumber: '551399998888',
      addresseeId: addressee.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryAddresseesRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Anderson Rocha',
        email: 'anderson@teste.com',
      }),
    )
  })
})

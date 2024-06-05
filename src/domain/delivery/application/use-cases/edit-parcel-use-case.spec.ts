import { makeAddress } from 'test/factories/make-address-factory'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { makeParcel } from 'test/factories/make-parcel-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'

import { EditParcelUseCase } from './edit-parcel-use-case'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryParcelsRepository: InMemoryParcelsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: EditParcelUseCase

describe('Edit Parcel Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryAddressesRepository,
      inMemoryAttachmentsRepository,
    )
    sut = new EditParcelUseCase(
      inMemoryParcelsRepository,
      inMemoryAddressesRepository,
    )
  })

  it('should be able to edit a parcel', async () => {
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const address = makeAddress({ addresseeId: addressee.id })
    await inMemoryAddressesRepository.create(address)
    const parcel = makeParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      title: 'Parcel title',
      description: 'Parcel description',
    })
    await inMemoryParcelsRepository.create(parcel)
    const result = await sut.execute({
      parcelId: parcel.id.toString(),
      addressId: address.id.toString(),
      title: 'New parcel title',
      description: 'New parcel description',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        parcel: expect.objectContaining({
          title: 'New parcel title',
          description: 'New parcel description',
        }),
      }),
    )
  })
})

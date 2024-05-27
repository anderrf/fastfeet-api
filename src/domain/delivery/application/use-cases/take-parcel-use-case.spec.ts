import { makeAddress } from 'test/factories/make-address-factory'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { makeParcel } from 'test/factories/make-parcel-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'

import { TakeParcelUseCase } from './take-parcel-use-case'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let inMemoryParcelsRepository: InMemoryParcelsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: TakeParcelUseCase

describe('Take Parcel Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryParcelsRepository = new InMemoryParcelsRepository()
    sut = new TakeParcelUseCase(
      inMemoryDeliveryPersonsRepository,
      inMemoryParcelsRepository,
    )
  })

  it('should be able to take a parcel', async () => {
    const deliveryPerson = makeDeliveryPerson()
    await inMemoryDeliveryPersonsRepository.create(deliveryPerson)
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const address = makeAddress({ addresseeId: addressee.id })
    await inMemoryAddressesRepository.create(address)
    const parcel = makeParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      readyAt: new Date(),
    })
    await inMemoryParcelsRepository.create(parcel)
    const result = await sut.execute({
      parcelId: parcel.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelsRepository.items[0]).toEqual(
      expect.objectContaining({ status: 3, takenAt: expect.any(Date) }),
    )
  })
})

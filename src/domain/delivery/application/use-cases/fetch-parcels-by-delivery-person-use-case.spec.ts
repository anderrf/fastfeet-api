import { makeAddress } from 'test/factories/make-address-factory'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { makeParcel } from 'test/factories/make-parcel-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'

import { FetchParcelsByDeliveryPersonUseCase } from './fetch-parcels-by-delivery-person-use-case'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let inMemoryParcelsRepository: InMemoryParcelsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: FetchParcelsByDeliveryPersonUseCase

describe('Fetch Person By Delivery Person Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryAddressesRepository,
    )
    sut = new FetchParcelsByDeliveryPersonUseCase(inMemoryParcelsRepository)
  })

  it('should be able to fetch parcels assigned to a delivery person', async () => {
    const firstDeliveryPerson = makeDeliveryPerson()
    await inMemoryDeliveryPersonsRepository.create(firstDeliveryPerson)
    const secondDeliveryPerson = makeDeliveryPerson()
    await inMemoryDeliveryPersonsRepository.create(secondDeliveryPerson)
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const address = makeAddress({ addresseeId: addressee.id })
    await inMemoryAddressesRepository.create(address)
    const firstParcel = makeParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      title: 'First parcel',
      deliveredBy: firstDeliveryPerson.id,
      takenAt: new Date(),
    })
    await inMemoryParcelsRepository.create(firstParcel)
    const secondParcel = makeParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      title: 'Second parcel',
      deliveredBy: secondDeliveryPerson.id,
      takenAt: new Date(),
    })
    await inMemoryParcelsRepository.create(secondParcel)
    const result = await sut.execute({
      deliveryPersonId: firstDeliveryPerson.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.parcels.length).toEqual(1)
    expect(result.value?.parcels[0]).toEqual(
      expect.objectContaining({
        deliveredBy: firstDeliveryPerson.id,
        title: 'First parcel',
      }),
    )
  })
})

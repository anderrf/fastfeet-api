import { makeAddress } from 'test/factories/make-address-factory'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { makeParcel } from 'test/factories/make-parcel-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'

import { FetchNearbyParcelsUseCase } from './fetch-nearby-parcels-use-case'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let inMemoryParcelsRepository: InMemoryParcelsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: FetchNearbyParcelsUseCase

describe('Fetch Nearby Parcels Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryAddressesRepository,
    )
    sut = new FetchNearbyParcelsUseCase(inMemoryParcelsRepository)
  })

  it('should be able to fetch parcels addressed to a location nearby a delivery person', async () => {
    const deliveryPerson = makeDeliveryPerson()
    await inMemoryDeliveryPersonsRepository.create(deliveryPerson)
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const firstAddress = makeAddress({
      addresseeId: addressee.id,
      latitude: -51,
      longitude: -51,
    })
    await inMemoryAddressesRepository.create(firstAddress)
    const secondAddress = makeAddress({
      addresseeId: addressee.id,
      latitude: -81,
      longitude: -81,
    })
    await inMemoryAddressesRepository.create(secondAddress)
    const firstParcel = makeParcel({
      addresseeId: addressee.id,
      addressId: firstAddress.id,
      title: 'First parcel',
      deliveredBy: deliveryPerson.id,
      takenAt: new Date(),
    })
    await inMemoryParcelsRepository.create(firstParcel)
    const secondParcel = makeParcel({
      addresseeId: addressee.id,
      addressId: secondAddress.id,
      title: 'Second parcel',
      deliveredBy: deliveryPerson.id,
      takenAt: new Date(),
    })
    await inMemoryParcelsRepository.create(secondParcel)
    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      latitude: -50.99,
      longitude: -50.99,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.parcels.length).toEqual(1)
    expect(result.value?.parcels[0].title).toEqual('First parcel')
  })
})

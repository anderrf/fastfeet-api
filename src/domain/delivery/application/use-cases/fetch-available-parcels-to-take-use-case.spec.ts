import { makeAddress } from 'test/factories/make-address-factory'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { makeParcel } from 'test/factories/make-parcel-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'

import { FetchAvailableParcelsToTakeUseCase } from './fetch-available-parcels-to-take-use-case'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let inMemoryParcelsRepository: InMemoryParcelsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: FetchAvailableParcelsToTakeUseCase

describe('Fetch Available Parcels To Take Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryAddressesRepository,
    )
    sut = new FetchAvailableParcelsToTakeUseCase(inMemoryParcelsRepository)
  })

  it('should be able to fetch available parcels to take', async () => {
    const deliveryPerson = makeDeliveryPerson()
    await inMemoryDeliveryPersonsRepository.create(deliveryPerson)
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const firstAddress = makeAddress({
      addresseeId: addressee.id,
    })
    await inMemoryAddressesRepository.create(firstAddress)
    const secondAddress = makeAddress({
      addresseeId: addressee.id,
    })
    await inMemoryAddressesRepository.create(secondAddress)
    const firstParcel = makeParcel({
      addresseeId: addressee.id,
      addressId: firstAddress.id,
      title: 'First parcel',
      readyAt: new Date(),
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
    const result = await sut.execute()
    expect(result.isRight()).toBe(true)
    expect(result.value?.parcels.length).toEqual(1)
    expect(result.value?.parcels[0].title).toEqual('First parcel')
  })
})

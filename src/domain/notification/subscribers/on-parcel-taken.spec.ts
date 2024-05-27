import { makeAddress } from 'test/factories/make-address-factory'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { makeParcel } from 'test/factories/make-parcel-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'
import { waitFor } from 'test/utils/wait-for'
import { SpyInstance } from 'vitest'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../application/use-cases/send-notification'
import { OnParcelTaken } from './on-parcel-taken'

let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryParcelsRepository: InMemoryParcelsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Parcel Taken', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryAddressesRepository,
    )
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )
    new OnParcelTaken(inMemoryParcelsRepository, sendNotificationUseCase)
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
  })

  it('should send a notification when a parcel is taken for delivery', async () => {
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
    parcel.take(deliveryPerson.id)
    await inMemoryParcelsRepository.save(parcel)
    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})

import { makeAddress } from 'test/factories/make-address-factory'
import { makeAddressee } from 'test/factories/make-addressee-factory'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person-factory'
import { makeParcel } from 'test/factories/make-parcel-factory'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { InMemoryParcelsRepository } from 'test/repositories/in-memory-parcels-repository'

import { DeliverParcelUseCase } from './deliver-parcel-use-case'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeAttachment } from 'test/factories/make-attachment-factory'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let inMemoryParcelsRepository: InMemoryParcelsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: DeliverParcelUseCase

describe('Deliver Parcel Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository(
      inMemoryAddressesRepository,
    )
    inMemoryParcelsRepository = new InMemoryParcelsRepository(
      inMemoryAddressesRepository,
    )
    sut = new DeliverParcelUseCase(
      inMemoryDeliveryPersonsRepository,
      inMemoryAttachmentsRepository,
      inMemoryParcelsRepository,
    )
  })

  it('should be able to deliver a parcel', async () => {
    const attachment = makeAttachment()
    await inMemoryAttachmentsRepository.create(attachment)
    const deliveryPerson = makeDeliveryPerson()
    await inMemoryDeliveryPersonsRepository.create(deliveryPerson)
    const addressee = makeAddressee()
    await inMemoryAddresseesRepository.create(addressee)
    const address = makeAddress({ addresseeId: addressee.id })
    await inMemoryAddressesRepository.create(address)
    const parcel = makeParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      takenAt: new Date(),
      deliveredBy: deliveryPerson.id,
    })
    await inMemoryParcelsRepository.create(parcel)
    const result = await sut.execute({
      parcelId: parcel.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      attachmentId: attachment.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryParcelsRepository.items[0]).toEqual(
      expect.objectContaining({ status: 4, deliveredAt: expect.any(Date) }),
    )
  })
})

import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address-factory'
import { AddresseeFactory } from 'test/factories/make-addressee-factory'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person-factory'
import { ParcelFactory } from 'test/factories/make-parcel-factory'
import { waitFor } from 'test/utils/wait-for'

import { PrismaService } from '../database/prisma/prisma.service'

describe('On Parcel Ready [E2E]', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let deliveryPersonFactory: DeliveryPersonFactory
  let addresseeFactory: AddresseeFactory
  let addressFactory: AddressFactory
  let parcelFactory: ParcelFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliveryPersonFactory,
        AddresseeFactory,
        AddressFactory,
        ParcelFactory,
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    addressFactory = moduleRef.get(AddressFactory)
    parcelFactory = moduleRef.get(ParcelFactory)
    DomainEvents.shouldRun = true
    await app.init()
  })

  it('should send a notification when parcel is available', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'DELIVERY_PERSON',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const address = await addressFactory.makePrismaAddress({
      addresseeId: addressee.id,
    })
    const parcel = await parcelFactory.makePrismaParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      createdAt: new Date('2024-03-01T00:00:00'),
    })
    const parcelId = parcel.id.toString()
    await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/make-available`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: addressee.id.toString(),
        },
      })
      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})

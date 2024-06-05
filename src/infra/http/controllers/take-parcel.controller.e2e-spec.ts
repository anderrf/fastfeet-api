import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address-factory'
import { AddresseeFactory } from 'test/factories/make-addressee-factory'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person-factory'
import { ParcelFactory } from 'test/factories/make-parcel-factory'

describe('Take Parcel (E2E)', () => {
  let app: INestApplication
  let deliveryPersonFactory: DeliveryPersonFactory
  let addresseeFactory: AddresseeFactory
  let addressFactory: AddressFactory
  let parcelFactory: ParcelFactory
  let prisma: PrismaService
  let jwt: JwtService
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
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    addressFactory = moduleRef.get(AddressFactory)
    parcelFactory = moduleRef.get(ParcelFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PATCH] /parcels/:parcelId/take', async () => {
    const authorDeliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({
      sub: authorDeliveryPerson.id.toString(),
      role: 'DELIVERY_PERSON',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const address = await addressFactory.makePrismaAddress({
      addresseeId: addressee.id,
    })
    const addressId = address.id.toString()
    const parcel = await parcelFactory.makePrismaParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      createdAt: new Date('2024-03-01T00:00:00'),
      readyAt: new Date('2024-03-02T00:00:00'),
    })
    const parcelId = parcel.id.toString()
    const response = await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/take`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(204)
    const parcelOnDatabase = await prisma.parcel.findUnique({
      where: { id: parcelId },
    })
    expect(parcelOnDatabase).toEqual(
      expect.objectContaining({
        takenAt: expect.any(Date),
        deliveredBy: authorDeliveryPerson.id.toString(),
      }),
    )
  })
})

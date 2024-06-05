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

describe('Fetch Nearby Parcels (E2E)', () => {
  let app: INestApplication
  let deliverypersonFactory: DeliveryPersonFactory
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
    deliverypersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    addressFactory = moduleRef.get(AddressFactory)
    parcelFactory = moduleRef.get(ParcelFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /parcels/fetch-by-delivery-person', async () => {
    const deliveryPerson =
      await deliverypersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({
      sub: deliveryPerson.id.toString(),
      role: 'DELIVERY_PERSON',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const firstAddress = await addressFactory.makePrismaAddress({
      addresseeId: addressee.id,
      latitude: -51,
      longitude: -71,
    })
    const secondAddress = await addressFactory.makePrismaAddress({
      addresseeId: addressee.id,
      latitude: 50.1,
      longitude: 70.1,
    })
    const firstParcel = await parcelFactory.makePrismaParcel({
      title: 'Nearby Parcel',
      addresseeId: addressee.id,
      addressId: firstAddress.id,
      createdAt: new Date('2024-03-01T01:00:00'),
      readyAt: new Date('2024-03-02T01:00:00'),
    })
    const secondParcel = await parcelFactory.makePrismaParcel({
      title: 'Distant Parcel',
      addresseeId: addressee.id,
      addressId: secondAddress.id,
      createdAt: new Date('2024-03-01T02:00:00'),
      readyAt: new Date('2024-03-02T02:00:00'),
    })
    const response = await request(app.getHttpServer())
      .get(`/parcels/fetch-nearby`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        latitude: -50.99999999,
        longitude: -70.99999999,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.parcels).toHaveLength(1)
    expect(response.body.parcels[0]).toEqual(
      expect.objectContaining({ title: 'Nearby Parcel' }),
    )
  })
})

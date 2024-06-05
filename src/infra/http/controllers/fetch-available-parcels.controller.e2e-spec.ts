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

describe('Fetch Available Parcels (E2E)', () => {
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

  test('[GET] /parcels/fetch-available', async () => {
    const deliveryPerson =
      await deliverypersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({
      sub: deliveryPerson.id.toString(),
      role: 'DELIVERY_PERSON',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const address = await addressFactory.makePrismaAddress({
      addresseeId: addressee.id,
    })
    const addressId = address.id.toString()
    const firstParcel = await parcelFactory.makePrismaParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      createdAt: new Date('2024-03-01T00:00:00'),
      readyAt: new Date('2024-03-02T00:00:00'),
    })
    const secondParcel = await parcelFactory.makePrismaParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      createdAt: new Date('2024-03-01T00:00:00'),
      readyAt: new Date('2024-03-02T00:00:00'),
      takenAt: new Date('2024-03-03T00:00:00'),
      deliveredBy: deliveryPerson.id,
    })
    const response = await request(app.getHttpServer())
      .get(`/parcels/fetch-available`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.parcels).toHaveLength(1)
  })
})

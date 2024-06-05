import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address-factory'
import { AddresseeFactory } from 'test/factories/make-addressee-factory'
import { AdminFactory } from 'test/factories/make-admin-factory'
import { AttachmentFactory } from 'test/factories/make-attachment-factory'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person-factory'
import { ParcelFactory } from 'test/factories/make-parcel-factory'

describe('Return Parcel (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let deliveryPersonFactory: DeliveryPersonFactory
  let addresseeFactory: AddresseeFactory
  let addressFactory: AddressFactory
  let parcelFactory: ParcelFactory
  let attachmentFactory: AttachmentFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliveryPersonFactory,
        AdminFactory,
        AddresseeFactory,
        AddressFactory,
        ParcelFactory,
        AttachmentFactory,
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    addressFactory = moduleRef.get(AddressFactory)
    parcelFactory = moduleRef.get(ParcelFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PATCH] /parcels/:parcelId/return', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({
      sub: admin.id.toString(),
      role: 'ADMIN',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const address = await addressFactory.makePrismaAddress({
      addresseeId: addressee.id,
    })
    const attachment = await attachmentFactory.makePrismaAttachment()
    const parcel = await parcelFactory.makePrismaParcel({
      addresseeId: addressee.id,
      addressId: address.id,
      createdAt: new Date('2024-03-01T00:00:00'),
      readyAt: new Date('2024-03-02T00:00:00'),
      takenAt: new Date('2024-03-03T00:00:00'),
      deliveredBy: deliveryPerson.id,
      deliveredAt: new Date('2024-03-04T00:00:00'),
      attachmentId: attachment.id,
    })
    const parcelId = parcel.id.toString()
    const response = await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/return`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(204)
    const parcelOnDatabase = await prisma.parcel.findUnique({
      where: { id: parcelId },
    })
    expect(parcelOnDatabase).toEqual(
      expect.objectContaining({
        returnedAt: expect.any(Date),
      }),
    )
  })
})

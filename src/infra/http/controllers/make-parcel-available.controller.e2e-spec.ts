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
import { ParcelFactory } from 'test/factories/make-parcel-factory'

describe('Make Parcel Available (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let addresseeFactory: AddresseeFactory
  let addressFactory: AddressFactory
  let parcelFactory: ParcelFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        AddresseeFactory,
        AddressFactory,
        ParcelFactory,
      ],
    }).compile()
    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    addressFactory = moduleRef.get(AddressFactory)
    parcelFactory = moduleRef.get(ParcelFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PATCH] /parcels/:parcelId/make-available', async () => {
    const authorAdmin = await adminFactory.makePrismaAdmin()
    const accessToken = await jwt.sign({
      sub: authorAdmin.id.toString(),
      role: 'ADMIN',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const address = await addressFactory.makePrismaAddress({
      addresseeId: addressee.id,
    })
    const addressId = address.id.toString()
    const parcel = await parcelFactory.makePrismaParcel({
      addresseeId: addressee.id,
      addressId: address.id,
    })
    const parcelId = parcel.id.toString()
    const response = await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/make-available`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(204)
    const parcelOnDatabase = await prisma.parcel.findUnique({
      where: { id: parcelId },
    })
    expect(parcelOnDatabase).toEqual(
      expect.objectContaining({
        readyAt: expect.any(Date),
      }),
    )
  })
})

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddresseeFactory } from 'test/factories/make-addressee-factory'
import { AdminFactory } from 'test/factories/make-admin-factory'

describe('Create Address (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let addresseeFactory: AddresseeFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, AddresseeFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /addressees/:addresseeId/addresses', async () => {
    const authorAdmin = await adminFactory.makePrismaAdmin()
    const accessToken = await jwt.sign({
      sub: authorAdmin.id.toString(),
      role: 'ADMIN',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const addresseeId = addressee.id.toString()
    const response = await request(app.getHttpServer())
      .post(`/addressees/${addresseeId}/addresses`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        street: 'Av São Paulo',
        number: 1000,
        district: 'Centro',
        zipCode: '11730-000',
        city: 'Mongaguá',
        state: 'São Paulo',
        country: 'Brasil',
        latitude: -50,
        longitude: -70,
      })
    expect(response.statusCode).toBe(201)
    const addressOnDatabase = await prisma.address.findFirst({
      where: { addresseeId },
    })
    expect(addressOnDatabase).toEqual(
      expect.objectContaining({
        street: 'Av São Paulo',
        number: '1000',
      }),
    )
  })
})

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddresseeFactory } from 'test/factories/make-addressee-factory'
import { AdminFactory } from 'test/factories/make-admin-factory'

describe('Edit Addressee (E2E)', () => {
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

  test('[PUT] /addressees/:addresseeId', async () => {
    const authorAdmin = await adminFactory.makePrismaAdmin()
    const accessToken = await jwt.sign({
      sub: authorAdmin.id.toString(),
      role: 'ADMIN',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const addresseeId = addressee.id.toString()
    const response = await request(app.getHttpServer())
      .put(`/addressees/${addresseeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Anderson Rocha',
        email: 'anderson@teste.com',
        document: '11122233396',
        phoneNumber: '5513999990000',
      })
    expect(response.statusCode).toBe(204)
    const addresseeOnDatabase = await prisma.addressee.findUnique({
      where: { id: addresseeId },
    })
    expect(addresseeOnDatabase).toEqual(
      expect.objectContaining({
        name: 'Anderson Rocha',
        document: '11122233396',
      }),
    )
  })
})

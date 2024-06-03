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

describe('Delete Address (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let addresseeFactory: AddresseeFactory
  let addressFactory: AddressFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, AddresseeFactory, AddressFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    addressFactory = moduleRef.get(AddressFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[DELETE] /addressees/:addresseeId/addresses/:addressId', async () => {
    const authorAdmin = await adminFactory.makePrismaAdmin()
    const accessToken = await jwt.sign({
      sub: authorAdmin.id.toString(),
      role: 'ADMIN',
    })
    const addressee = await addresseeFactory.makePrismaAddressee()
    const addresseeId = addressee.id.toString()
    const address = await addressFactory.makePrismaAddress({
      addresseeId: addressee.id,
    })
    const addressId = address.id.toString()
    const response = await request(app.getHttpServer())
      .delete(`/addressees/${addresseeId}/addresses/${addressId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(204)
    const addressOnDatabase = await prisma.address.findFirst({
      where: { id: addressId },
    })
    expect(addressOnDatabase).toBeNull()
  })
})

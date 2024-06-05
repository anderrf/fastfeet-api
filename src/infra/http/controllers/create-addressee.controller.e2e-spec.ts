import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin-factory'

describe('Create Addressee (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /addressees', async () => {
    const authorAdmin = await adminFactory.makePrismaAdmin()
    const accessToken = await jwt.sign({
      sub: authorAdmin.id.toString(),
      role: 'ADMIN',
    })
    const response = await request(app.getHttpServer())
      .post(`/addressees`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Anderson Rocha',
        email: 'anderson@teste.com',
        document: '11122233396',
        phoneNumber: '5513999990000',
      })
    expect(response.statusCode).toBe(201)
    const addresseeOnDatabase = await prisma.addressee.findFirst({
      where: { name: 'Anderson Rocha' },
    })
    expect(addresseeOnDatabase).toBeTruthy()
  })
})

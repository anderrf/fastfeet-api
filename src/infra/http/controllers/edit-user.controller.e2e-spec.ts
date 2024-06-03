import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin-factory'

describe('Edit User (E2E)', () => {
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

  test('[PUT] /users/:userId', async () => {
    const authorAdmin = await adminFactory.makePrismaAdmin()
    const adminToEdit = await adminFactory.makePrismaAdmin()
    const accessToken = await jwt.sign({
      sub: authorAdmin.id.toString(),
      role: 'ADMIN',
    })
    const adminToEditId = adminToEdit.id.toString()
    const response = await request(app.getHttpServer())
      .put(`/users/${adminToEditId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Anderson Rocha',
        email: 'anderson@teste.com',
        cpf: '11122233396',
        phoneNumber: '5513999990000',
        role: 'ADMIN',
      })
    expect(response.statusCode).toBe(204)
    const adminOnDatabase = await prisma.user.findUnique({
      where: { id: adminToEditId },
    })
    expect(adminOnDatabase).toEqual(
      expect.objectContaining({
        name: 'Anderson Rocha',
        cpf: '11122233396',
      }),
    )
  })
})

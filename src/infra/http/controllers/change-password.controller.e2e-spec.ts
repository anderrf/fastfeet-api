import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin-factory'

describe('Change Password (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let prisma: PrismaService
  let jwt: JwtService
  let hasher: HashComparer
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    hasher = moduleRef.get(HashComparer)
    await app.init()
  })

  test('[PATCH] /users/:userId/change-password', async () => {
    const authorAdmin = await adminFactory.makePrismaAdmin()
    const adminToEdit = await adminFactory.makePrismaAdmin()
    const accessToken = await jwt.sign({
      sub: authorAdmin.id.toString(),
      role: 'ADMIN',
    })
    const adminToEditId = adminToEdit.id.toString()
    const response = await request(app.getHttpServer())
      .patch(`/users/${adminToEditId}/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '123456',
        role: 'ADMIN',
      })
    expect(response.statusCode).toBe(204)
    const adminOnDatabase = await prisma.user.findUnique({
      where: { id: adminToEditId },
    })
    expect(await hasher.compare('123456', adminOnDatabase!.password)).toBe(true)
  })
})

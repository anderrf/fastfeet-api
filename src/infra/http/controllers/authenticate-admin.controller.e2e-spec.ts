import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin-factory'

describe('Authenticate Admin (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let hasher: HashGenerator
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    hasher = moduleRef.get(HashGenerator)
    await app.init()
  })

  test('[POST] /sessions/admin', async () => {
    await adminFactory.makePrismaAdmin({
      cpf: Cpf.createFromText('65403999019'),
      password: await hasher.hash('123456'),
    })
    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({
        cpf: '65403999019',
        password: '123456',
      })
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ access_token: expect.any(String) })
  })
})

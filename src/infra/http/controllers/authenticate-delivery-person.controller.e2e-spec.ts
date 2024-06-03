import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person-factory'

describe('Authenticate Delivery Person (E2E)', () => {
  let app: INestApplication
  let deliverypersonFactory: DeliveryPersonFactory
  let hasher: HashGenerator
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    deliverypersonFactory = moduleRef.get(DeliveryPersonFactory)
    hasher = moduleRef.get(HashGenerator)
    await app.init()
  })

  test('[POST] /sessions/delivery-person', async () => {
    await deliverypersonFactory.makePrismaDeliveryPerson({
      cpf: Cpf.createFromText('65403999019'),
      password: await hasher.hash('123456'),
    })
    const response = await request(app.getHttpServer())
      .post('/sessions/delivery-person')
      .send({
        cpf: '65403999019',
        password: '123456',
      })
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ access_token: expect.any(String) })
  })
})

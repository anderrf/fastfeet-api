import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person-factory'

describe('Upload Attachment (E2E)', () => {
  let app: INestApplication
  let deliverypersonFactory: DeliveryPersonFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    deliverypersonFactory = moduleRef.get(DeliveryPersonFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /attachments', async () => {
    const authorDeliveryPerson =
      await deliverypersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({
      sub: authorDeliveryPerson.id.toString(),
      role: 'DELIVERY_PERSON',
    })
    const response = await request(app.getHttpServer())
      .post(`/attachments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpg')
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ attachment_id: expect.any(String) })
  })
})

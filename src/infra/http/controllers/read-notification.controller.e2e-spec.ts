import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person-factory'
import { NotificationFactory } from 'test/factories/make-notification'

describe('Read Notification (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let deliveryPersonFactory: DeliveryPersonFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory, NotificationFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })
    const notificationId = notification.id.toString()
    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ recipientId: user.id.toString() })
    expect(response.statusCode).toBe(204)
    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    })
    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})

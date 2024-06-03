import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Register User (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'Anderson Farias',
      email: 'anderson.farias@example.com',
      phoneNumber: '551399998888',
      cpf: '65403999019',
      password: '123456',
      role: 'DELIVERY_PERSON',
    })
    expect(response.statusCode).toBe(201)
    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '65403999019',
      },
    })
    expect(userOnDatabase).toBeTruthy()
  })
})

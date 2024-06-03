import { InvalidDocumentError } from '@/domain/delivery/application/use-cases/errors/invalid-document-error'
import { UserWithSameDocumentAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-document-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-phone-number-already-exists-error'
import { RegisterDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/register-delivery-person-use-case'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { RegisterAdminUseCase } from './../../../domain/delivery/application/use-cases/register-admin-use-case'
import { Public } from '@/infra/auth/public'

const registerUserBodySchema = z.object({
  role: z.enum(['ADMIN', 'DELIVERY_PERSON']).default('DELIVERY_PERSON'),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  cpf: z.string(),
  password: z.string(),
})
type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>

@Controller('/users')
@Public()
export class RegisterUserController {
  constructor(
    private registerAdminUseCase: RegisterAdminUseCase,
    private registerDeliveryPersonUseCase: RegisterDeliveryPersonUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  async handle(@Body() body: RegisterUserBodySchema) {
    const { name, cpf, role, phoneNumber, email, password } = body
    let result
    if (role === 'ADMIN') {
      result = await this.registerAdminUseCase.execute({
        name,
        cpf,
        email,
        phoneNumber,
        password,
      })
    } else {
      result = await this.registerDeliveryPersonUseCase.execute({
        name,
        cpf,
        email,
        phoneNumber,
        password,
      })
    }
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidDocumentError:
          throw new BadRequestException(error.message)
        case UserWithSameDocumentAlreadyExistsError:
        case UserWithSameEmailAlreadyExistsError:
        case UserWithSamePhoneNumberAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

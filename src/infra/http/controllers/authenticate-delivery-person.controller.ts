import { AuthenticateDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/authenticate-delivery-person-use-case'
import { InvalidCredentialsError } from '@/domain/delivery/application/use-cases/errors/invalid-credentials-error'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateDeliveryPersonBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})
type AuthenticateDeliveryPersonBodySchema = z.infer<
  typeof authenticateDeliveryPersonBodySchema
>

@Controller('/sessions/delivery-person')
@Public()
export class AuthenticateDeliveryPersonController {
  constructor(
    private authenticateDeliveryPersonUseCase: AuthenticateDeliveryPersonUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateDeliveryPersonBodySchema))
  async handle(@Body() body: AuthenticateDeliveryPersonBodySchema) {
    const { cpf, password } = body
    const result = await this.authenticateDeliveryPersonUseCase.execute({
      password,
      cpf,
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { accessToken } = result.value
    return {
      access_token: accessToken,
    }
  }
}

import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin-use-case'
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

const authenticateAdminBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})
type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>

@Controller('/sessions/admin')
@Public()
export class AuthenticateAdminController {
  constructor(private authenticateAdminUseCase: AuthenticateAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateAdminBodySchema))
  async handle(@Body() body: AuthenticateAdminBodySchema) {
    const { cpf, password } = body
    const result = await this.authenticateAdminUseCase.execute({
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

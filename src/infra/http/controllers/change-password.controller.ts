import { ChangeAdminPasswordUseCase } from '@/domain/delivery/application/use-cases/change-admin-password-use-case'
import { ChangeDeliveryPersonPasswordUseCase } from '@/domain/delivery/application/use-cases/change-delivery-person-password-use-case'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const changePasswordBodySchema = z.object({
  password: z.string(),
  role: z.enum(['ADMIN', 'DELIVERY_PERSON']).default('DELIVERY_PERSON'),
})
const changePasswordValidationPipe = new ZodValidationPipe(
  changePasswordBodySchema,
)
type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller('/users/:userId/change-password')
export class ChangePasswordController {
  constructor(
    private changeAdminPasswordUseCase: ChangeAdminPasswordUseCase,
    private changeDeliveryPersonPasswordUseCase: ChangeDeliveryPersonPasswordUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(changePasswordValidationPipe) body: ChangePasswordBodySchema,
    @Param('userId') userId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorRole = user.role
    if (authorRole !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const { password, role } = body
    let result
    if (role === 'ADMIN') {
      result = await this.changeAdminPasswordUseCase.execute({
        password,
        adminId: userId,
      })
    } else {
      result = await this.changeDeliveryPersonPasswordUseCase.execute({
        password,
        deliveryPersonId: userId,
      })
    }
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

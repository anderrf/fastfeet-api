import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'

import { ReturnParcelUseCase } from '../../../domain/delivery/application/use-cases/return-parcel-use-case'

@Controller('parcels/:parcelId/return')
export class ReturnParcelController {
  constructor(private returnParcelUseCase: ReturnParcelUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('parcelId') parcelId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role, sub } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const result = await this.returnParcelUseCase.execute({
      parcelId,
      deliveryPersonId: sub,
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException()
        default:
          throw new BadRequestException()
      }
    }
  }
}

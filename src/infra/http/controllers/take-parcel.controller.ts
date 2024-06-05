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

import { TakeParcelUseCase } from '../../../domain/delivery/application/use-cases/take-parcel-use-case'

@Controller('parcels/:parcelId/take')
export class TakeParcelController {
  constructor(private takeParcelUseCase: TakeParcelUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('parcelId') parcelId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role, sub } = user
    if (role !== 'DELIVERY_PERSON') {
      throw new UnauthorizedException()
    }
    const result = await this.takeParcelUseCase.execute({
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

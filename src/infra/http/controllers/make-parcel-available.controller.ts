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

import { MakeParcelAvailableUseCase } from '../../../domain/delivery/application/use-cases/make-parcel-available-use-case'

@Controller('parcels/:parcelId/make-available')
export class MakeParcelAvailableController {
  constructor(private makeParcelAvailableUseCase: MakeParcelAvailableUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('parcelId') parcelId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const result = await this.makeParcelAvailableUseCase.execute({
      parcelId,
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

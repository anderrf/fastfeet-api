import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

import { DeleteParcelUseCase } from '../../../domain/delivery/application/use-cases/delete-parcel-use-case'

@Controller('parcels/:parcelId')
export class DeleteParcelController {
  constructor(private deleteParcelUseCase: DeleteParcelUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('parcelId') parcelId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const result = await this.deleteParcelUseCase.execute({
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

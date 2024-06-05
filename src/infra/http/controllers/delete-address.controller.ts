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

import { DeleteAddressUseCase } from '../../../domain/delivery/application/use-cases/delete-address-use-case'

@Controller('addressees/:addresseeId/addresses/:addressId')
export class DeleteAddressController {
  constructor(private deleteAddressUseCase: DeleteAddressUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('addresseeId') addresseeId: string,
    @Param('addressId') addressId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const result = await this.deleteAddressUseCase.execute({
      addressId,
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

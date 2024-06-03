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

import { DeleteAddresseeUseCase } from '../../../domain/delivery/application/use-cases/delete-addressee-use-case'

@Controller('addressees/:addresseeId')
export class DeleteAddresseeController {
  constructor(private deleteAddresseeUseCase: DeleteAddresseeUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('addresseeId') addresseeId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const result = await this.deleteAddresseeUseCase.execute({
      addresseeId,
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

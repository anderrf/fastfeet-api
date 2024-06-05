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
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { EditParcelUseCase } from '../../../domain/delivery/application/use-cases/edit-parcel-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editParcelBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  addressId: z.string().uuid(),
})
const editParcelValidationPipe = new ZodValidationPipe(editParcelBodySchema)
type EditParcelBodySchema = z.infer<typeof editParcelBodySchema>

@Controller('parcels/:parcelId')
export class EditParcelController {
  constructor(private editParcelUseCase: EditParcelUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editParcelValidationPipe) body: EditParcelBodySchema,
    @Param('parcelId') parcelId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const { title, description, addressId } = body
    const result = await this.editParcelUseCase.execute({
      title,
      description,
      addressId,
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

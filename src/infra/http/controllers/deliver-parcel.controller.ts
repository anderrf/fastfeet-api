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

import { DeliverParcelUseCase } from '../../../domain/delivery/application/use-cases/deliver-parcel-use-case'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editAddressBodySchema = z.object({
  attachmentId: z.string().uuid(),
})
const editAddressValidationPipe = new ZodValidationPipe(editAddressBodySchema)
type EditAddressBodySchema = z.infer<typeof editAddressBodySchema>

@Controller('parcels/:parcelId/deliver')
export class DeliverParcelController {
  constructor(private deliverParcelUseCase: DeliverParcelUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(editAddressValidationPipe) body: EditAddressBodySchema,
    @Param('parcelId') parcelId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role, sub } = user
    if (role !== 'DELIVERY_PERSON') {
      throw new UnauthorizedException()
    }
    const { attachmentId } = body
    const result = await this.deliverParcelUseCase.execute({
      parcelId,
      deliveryPersonId: sub,
      attachmentId,
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

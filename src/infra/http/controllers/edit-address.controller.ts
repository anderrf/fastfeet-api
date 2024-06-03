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

import { EditAddressUseCase } from '../../../domain/delivery/application/use-cases/edit-address-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editAddressBodySchema = z.object({
  street: z.string(),
  number: z.number().int(),
  district: z.string(),
  zipCode: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})
const editAddressValidationPipe = new ZodValidationPipe(editAddressBodySchema)
type EditAddressBodySchema = z.infer<typeof editAddressBodySchema>

@Controller('addressees/:addresseeId/addresses/:addressId')
export class EditAddressController {
  constructor(private editAddressUseCase: EditAddressUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editAddressValidationPipe) body: EditAddressBodySchema,
    @Param('addresseeId') addresseeId: string,
    @Param('addressId') addressId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const {
      street,
      number,
      district,
      zipCode,
      city,
      state,
      country,
      latitude,
      longitude,
    } = body
    const result = await this.editAddressUseCase.execute({
      addressId,
      street,
      number,
      district,
      zipCode,
      city,
      state,
      country,
      latitude,
      longitude,
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

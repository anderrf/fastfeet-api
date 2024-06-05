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
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateAddressUseCase } from '../../../domain/delivery/application/use-cases/create-address-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAddressBodySchema = z.object({
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
const createAddressValidationPipe = new ZodValidationPipe(
  createAddressBodySchema,
)
type CreateAddressBodySchema = z.infer<typeof createAddressBodySchema>

@Controller('addressees/:addresseeId/addresses')
export class CreateAddressController {
  constructor(private createAddressUseCase: CreateAddressUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(createAddressValidationPipe) body: CreateAddressBodySchema,
    @Param('addresseeId') addresseeId: string,
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
    const result = await this.createAddressUseCase.execute({
      addresseeId,
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

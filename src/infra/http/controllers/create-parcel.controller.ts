import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateParcelUseCase } from '../../../domain/delivery/application/use-cases/create-parcel-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createParcelBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  addresseeId: z.string().uuid(),
  addressId: z.string().uuid(),
})
const createParcelValidationPipe = new ZodValidationPipe(createParcelBodySchema)
type CreateParcelBodySchema = z.infer<typeof createParcelBodySchema>

@Controller('parcels')
export class CreateParcelController {
  constructor(private createParcelUseCase: CreateParcelUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(createParcelValidationPipe) body: CreateParcelBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const { title, description, addresseeId, addressId } = body
    const result = await this.createParcelUseCase.execute({
      title,
      description,
      addresseeId,
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

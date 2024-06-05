import { CreateAddresseeUseCase } from './../../../domain/delivery/application/use-cases/create-addressee-use-case'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { InvalidDocumentError } from '@/domain/delivery/application/use-cases/errors/invalid-document-error'
import { UserWithSameDocumentAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-document-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-phone-number-already-exists-error'

const createAddresseeBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  document: z.string(),
  phoneNumber: z.string(),
})
const createAddresseeValidationPipe = new ZodValidationPipe(
  createAddresseeBodySchema,
)
type CreateAddresseeBodySchema = z.infer<typeof createAddresseeBodySchema>

@Controller('addressees')
export class CreateAddresseeController {
  constructor(private createAddresseeUseCase: CreateAddresseeUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(createAddresseeValidationPipe) body: CreateAddresseeBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const { name, email, document, phoneNumber } = body
    const result = await this.createAddresseeUseCase.execute({
      name,
      email,
      document,
      phoneNumber,
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidDocumentError:
          throw new BadRequestException()
        case UserWithSameDocumentAlreadyExistsError:
        case UserWithSameEmailAlreadyExistsError:
        case UserWithSamePhoneNumberAlreadyExistsError:
          throw new ConflictException()
        default:
          throw new BadRequestException()
      }
    }
  }
}

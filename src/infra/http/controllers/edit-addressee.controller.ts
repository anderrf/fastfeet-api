import { InvalidDocumentError } from '@/domain/delivery/application/use-cases/errors/invalid-document-error'
import { UserWithSameDocumentAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-document-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-phone-number-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { EditAddresseeUseCase } from '../../../domain/delivery/application/use-cases/edit-addressee-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found-error'

const editAddresseeBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  document: z.string(),
  phoneNumber: z.string(),
})
const editAddresseeValidationPipe = new ZodValidationPipe(
  editAddresseeBodySchema,
)
type EditAddresseeBodySchema = z.infer<typeof editAddresseeBodySchema>

@Controller('addressees/:addresseeId')
export class EditAddresseeController {
  constructor(private editAddresseeUseCase: EditAddresseeUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editAddresseeValidationPipe) body: EditAddresseeBodySchema,
    @Param('addresseeId') addresseeId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { role } = user
    if (role !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const { name, email, document, phoneNumber } = body
    const result = await this.editAddresseeUseCase.execute({
      addresseeId,
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
        case ResourceNotFoundError:
          throw new NotFoundException()
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

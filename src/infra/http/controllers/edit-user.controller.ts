import { EditAdminUseCase } from '@/domain/delivery/application/use-cases/edit-admin-use-case'
import { InvalidDocumentError } from '@/domain/delivery/application/use-cases/errors/invalid-document-error'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/errors/resource-not-found-error'
import { UserWithSameDocumentAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-document-already-exists-error'
import { UserWithSameEmailAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-email-already-exists-error'
import { UserWithSamePhoneNumberAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-with-same-phone-number-already-exists-error'
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

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditDeliveryPersonUseCase } from './../../../domain/delivery/application/use-cases/edit-delivery-person-use-case'

const editUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  phoneNumber: z.string(),
  role: z.enum(['ADMIN', 'DELIVERY_PERSON']).default('DELIVERY_PERSON'),
})
const editUserValidationPipe = new ZodValidationPipe(editUserBodySchema)
type EditUserBodySchema = z.infer<typeof editUserBodySchema>

@Controller('/users/:userId')
export class EditUserController {
  constructor(
    private editAdminUseCase: EditAdminUseCase,
    private editDeliveryPersonUseCase: EditDeliveryPersonUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(editUserValidationPipe) body: EditUserBodySchema,
    @Param('userId') userId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorRole = user.role
    if (authorRole !== 'ADMIN') {
      throw new UnauthorizedException()
    }
    const { name, cpf, email, phoneNumber, role } = body
    let result
    if (role === 'ADMIN') {
      result = await this.editAdminUseCase.execute({
        name,
        cpf,
        email,
        phoneNumber,
        adminId: userId,
      })
    } else {
      result = await this.editDeliveryPersonUseCase.execute({
        name,
        cpf,
        email,
        phoneNumber,
        deliveryPersonId: userId,
      })
    }
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InvalidDocumentError:
          throw new BadRequestException(error.message)
        case UserWithSameDocumentAlreadyExistsError:
        case UserWithSameEmailAlreadyExistsError:
        case UserWithSamePhoneNumberAlreadyExistsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

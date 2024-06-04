import { InvalidAttachmentTypeError } from '@/domain/delivery/application/use-cases/errors/invalid-attachment-type-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnauthorizedException,
  UploadedFile,
} from '@nestjs/common'

import { UploadAttachmentUseCase } from '../../../domain/delivery/application/use-cases/upload-attachment-use-case'

@Controller('attachments')
export class UploadAttachmentController {
  constructor(private uploadAttachmentUseCase: UploadAttachmentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2MB
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { role } = user
    if (role !== 'DELIVERY_PERSON') {
      throw new UnauthorizedException()
    }
    const result = await this.uploadAttachmentUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { attachment } = result.value
    return {
      attachment_id: attachment.id.toString(),
    }
  }
}

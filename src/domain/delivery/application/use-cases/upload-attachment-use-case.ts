import { Either, left, right } from '@/core/types/either'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../storage/uploader'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Injectable } from '@nestjs/common'

interface UploadAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAttachmentUseCaseRequest): Promise<UploadAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|jpg|png))$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }
    const { url } = await this.uploader.upload({ fileName, fileType, body })
    const attachment = Attachment.create({
      title: fileName,
      url,
    })
    await this.attachmentsRepository.create(attachment)
    return right({ attachment })
  }
}

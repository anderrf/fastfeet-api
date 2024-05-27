import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
  abstract save(attachment: Attachment): Promise<void>
  abstract delete(attachment: Attachment): Promise<void>
  abstract findById(attachmentId: string): Promise<Attachment | null>
  abstract findByUrl(attachmentUrl: string): Promise<Attachment | null>
}

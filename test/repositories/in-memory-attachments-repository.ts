import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = this.items.find(
      (attachment) => attachment.id.toString() === id,
    )
    return attachment ?? null
  }

  async findByUrl(attachmentUrl: string): Promise<Attachment | null> {
    const attachment = this.items.find(
      (attachment) => attachment.url === attachmentUrl,
    )
    return attachment ?? null
  }

  async save(attachment: Attachment): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(attachment.id),
    )
    this.items[itemIndex] = attachment
  }

  async delete(attachment: Attachment): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(attachment.id),
    )
    this.items.splice(itemIndex, 1)
  }
}

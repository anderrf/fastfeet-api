import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)
    await this.prisma.attachment.create({ data })
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    })
    if (!attachment) {
      return null
    }
    return PrismaAttachmentMapper.toDomain(attachment)
  }

  async save(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)
    await this.prisma.attachment.update({
      data,
      where: { id: data.id },
    })
  }

  async delete(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)
    await this.prisma.attachment.delete({
      where: { id: data.id },
    })
  }

  async findByUrl(attachmentUrl: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findFirst({
      where: { url: attachmentUrl },
    })
    if (!attachment) {
      return null
    }
    return PrismaAttachmentMapper.toDomain(attachment)
  }
}

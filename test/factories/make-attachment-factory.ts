import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/delivery/enterprise/entities/attachment'
import { faker } from '@faker-js/faker'

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId,
): Attachment {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )
  return attachment
}

import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AttachmentProps {
  title: string
  url: string
}

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: UniqueEntityId) {
    return new Attachment(props, id)
  }

  public get title(): string {
    return this.props.title
  }

  public get url(): string {
    return this.props.url
  }
}

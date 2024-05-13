import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface PackageProps {
  title: string
  description: string
  createdAt: Date
  takenAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
}

export class Package extends Entity<PackageProps> {
  static create(
    props: Optional<PackageProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new Package(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  public get title(): string {
    return this.props.title
  }

  public set title(title: string) {
    this.props.title = title
  }

  public get description(): string {
    return this.props.description
  }

  public set description(description: string) {
    this.props.description = description
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get takenAt(): Date | null | undefined {
    return this.props.takenAt
  }

  public set takenAt(takenAt: Date | null | undefined) {
    this.props.takenAt = takenAt
  }

  public get deliveredAt(): Date | null | undefined {
    return this.props.deliveredAt
  }

  public set deliveredAt(deliveredAt: Date | null | undefined) {
    this.props.deliveredAt = deliveredAt
  }

  public get returnedAt(): Date | null | undefined {
    return this.props.returnedAt
  }

  public set returnedAt(returnedAt: Date | null | undefined) {
    this.props.returnedAt = returnedAt
  }
}

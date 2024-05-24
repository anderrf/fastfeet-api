import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum ParcelStatus {
  NEW = 1,
  READY = 2,
  TAKEN = 3,
  DELIVERED = 4,
  RETURNED = 5,
}

export interface ParcelProps {
  title: string
  description: string
  createdAt: Date
  addressId: UniqueEntityId
  addresseeId: UniqueEntityId
  deliveredBy?: UniqueEntityId | null
  readyAt?: Date | null
  takenAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
}

export class Parcel extends Entity<ParcelProps> {
  static create(
    props: Optional<ParcelProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new Parcel(
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

  public get readyAt(): Date | null | undefined {
    return this.props.readyAt
  }

  public makeAvailable(): void {
    this.props.readyAt = new Date()
    this.props.deliveredBy = null
    this.props.takenAt = null
    this.props.deliveredAt = null
    this.props.returnedAt = null
  }

  public get takenAt(): Date | null | undefined {
    return this.props.takenAt
  }

  public take(deliveryPersonId: UniqueEntityId) {
    this.props.deliveredBy = deliveryPersonId
    this.props.takenAt = new Date()
  }

  public get deliveredAt(): Date | null | undefined {
    return this.props.deliveredAt
  }

  public deliver() {
    this.props.deliveredAt = new Date()
  }

  public get returnedAt(): Date | null | undefined {
    return this.props.returnedAt
  }

  public return() {
    this.props.returnedAt = new Date()
  }

  public get addressId(): UniqueEntityId {
    return this.props.addressId
  }

  public set addressId(addressId: UniqueEntityId) {
    this.props.addressId = addressId
  }

  public get addresseeId(): UniqueEntityId {
    return this.props.addresseeId
  }

  public get deliveredBy(): UniqueEntityId | null | undefined {
    return this.props.deliveredBy
  }

  public get status(): ParcelStatus {
    if (this.returnedAt) {
      return ParcelStatus.RETURNED
    }
    if (this.deliveredAt) {
      return ParcelStatus.DELIVERED
    }
    if (this.takenAt) {
      return ParcelStatus.TAKEN
    }
    if (this.readyAt) {
      return ParcelStatus.READY
    }
    return ParcelStatus.NEW
  }
}
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ParcelTakenEvent } from '../events/parcel-taken-event'
import { ParcelDeliveredEvent } from '../events/parcel-delivered-event'
import { ParcelReturnedEvent } from '../events/parcel-returned-event'
import { ParcelReadyEvent } from '../events/parcel-ready-event'

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
  attachmentId?: UniqueEntityId | null
}

export class Parcel extends AggregateRoot<ParcelProps> {
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
    this.props.attachmentId = null
    this.addDomainEvent(new ParcelReadyEvent(this))
  }

  public get takenAt(): Date | null | undefined {
    return this.props.takenAt
  }

  public take(deliveryPersonId: UniqueEntityId) {
    this.props.deliveredBy = deliveryPersonId
    this.props.takenAt = new Date()
    this.addDomainEvent(new ParcelTakenEvent(this))
  }

  public get deliveredAt(): Date | null | undefined {
    return this.props.deliveredAt
  }

  public deliver(attachmentId: UniqueEntityId) {
    this.attachmentId = attachmentId
    this.props.deliveredAt = new Date()
    this.addDomainEvent(new ParcelDeliveredEvent(this))
  }

  public get returnedAt(): Date | null | undefined {
    return this.props.returnedAt
  }

  public return() {
    this.props.returnedAt = new Date()
    this.addDomainEvent(new ParcelReturnedEvent(this))
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
    const dates = [
      this.readyAt!,
      this.takenAt!,
      this.deliveredAt!,
      this.returnedAt!,
    ].filter((date) => !!date)
    if (!dates.length) {
      return ParcelStatus.NEW
    }
    const maxDate = dates.reduce((a, b) => (a > b ? a : b))
    if (+maxDate === +this.returnedAt!) {
      return ParcelStatus.RETURNED
    }
    if (+maxDate === +this.deliveredAt!) {
      return ParcelStatus.DELIVERED
    }
    if (+maxDate === +this.takenAt!) {
      return ParcelStatus.TAKEN
    }
    if (+maxDate === +this.readyAt!) {
      return ParcelStatus.READY
    }
    return ParcelStatus.NEW
  }

  public get attachmentId(): UniqueEntityId | null | undefined {
    return this.props.attachmentId
  }

  public set attachmentId(attachmentId: UniqueEntityId | null | undefined) {
    this.props.attachmentId = attachmentId
  }
}

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Parcel } from '../entities/parcel'

export class ParcelTakenEvent implements DomainEvent {
  public ocurredAt: Date
  public parcel: Parcel

  constructor(parcel: Parcel) {
    this.parcel = parcel
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.parcel.id
  }
}

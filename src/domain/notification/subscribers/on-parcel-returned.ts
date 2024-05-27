import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { ParcelReturnedEvent } from '@/domain/delivery/enterprise/events/parcel-returned-event'

import { SendNotificationUseCase } from '../application/use-cases/send-notification'

export class OnParcelReturned implements EventHandler {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendParcelreturnedNotification.bind(this),
      ParcelReturnedEvent.name,
    )
  }

  private async sendParcelreturnedNotification({
    parcel,
  }: ParcelReturnedEvent) {
    const returnedParcel = await this.parcelsRepository.findById(
      parcel.id.toString(),
    )
    if (returnedParcel) {
      await this.sendNotification.execute({
        recipientId: returnedParcel.deliveredBy!.toString(),
        title: `Pacote devolvido!`,
        content: `O pacote "${returnedParcel.title
          .substring(0, 20)
          .concat('...')}" foi devolvido pelo destinatário!`,
      })
    }
  }
}

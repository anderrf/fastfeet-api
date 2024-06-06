import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { ParcelDeliveredEvent } from '@/domain/delivery/enterprise/events/parcel-delivered-event'

import { SendNotificationUseCase } from '../application/use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnParcelDelivered implements EventHandler {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendParceldeliveredNotification.bind(this),
      ParcelDeliveredEvent.name,
    )
  }

  private async sendParceldeliveredNotification({
    parcel,
  }: ParcelDeliveredEvent) {
    const deliveredParcel = await this.parcelsRepository.findById(
      parcel.id.toString(),
    )
    if (deliveredParcel) {
      await this.sendNotification.execute({
        recipientId: deliveredParcel.addresseeId.toString(),
        title: `Pacote entregue!`,
        content: `Seu pacote "${deliveredParcel.title
          .substring(0, 20)
          .concat('...')}" foi entregue no endereço solicitado!`,
      })
    }
  }
}

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { ParcelReadyEvent } from '@/domain/delivery/enterprise/events/parcel-ready-event'

import { SendNotificationUseCase } from '../application/use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnParcelReady implements EventHandler {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendParcelReadyNotification.bind(this),
      ParcelReadyEvent.name,
    )
  }

  private async sendParcelReadyNotification({ parcel }: ParcelReadyEvent) {
    const readyParcel = await this.parcelsRepository.findById(
      parcel.id.toString(),
    )
    if (readyParcel) {
      await this.sendNotification.execute({
        recipientId: readyParcel.addresseeId.toString(),
        title: `Pacote pronto!`,
        content: `Seu pacote "${readyParcel.title
          .substring(0, 20)
          .concat('...')}" está pronto para coleta do entregador!`,
      })
    }
  }
}

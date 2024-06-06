import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { ParcelTakenEvent } from '@/domain/delivery/enterprise/events/parcel-taken-event'

import { SendNotificationUseCase } from '../application/use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnParcelTaken implements EventHandler {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendParceltakenNotification.bind(this),
      ParcelTakenEvent.name,
    )
  }

  private async sendParceltakenNotification({ parcel }: ParcelTakenEvent) {
    const takenParcel = await this.parcelsRepository.findById(
      parcel.id.toString(),
    )
    if (takenParcel) {
      await this.sendNotification.execute({
        recipientId: takenParcel.addresseeId.toString(),
        title: `Pacote enviado!`,
        content: `Seu pacote "${takenParcel.title
          .substring(0, 20)
          .concat('...')}" foi coletado e logo será entregue!`,
      })
    }
  }
}

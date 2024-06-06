import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { OnParcelReady } from '@/domain/notification/subscribers/on-parcel-ready'
import { OnParcelTaken } from '@/domain/notification/subscribers/on-parcel-taken'
import { OnParcelDelivered } from '@/domain/notification/subscribers/on-parcel-delivered'
import { OnParcelReturned } from '@/domain/notification/subscribers/on-parcel-returned'

@Module({
  imports: [DatabaseModule],
  providers: [
    ReadNotificationUseCase,
    SendNotificationUseCase,
    OnParcelReady,
    OnParcelTaken,
    OnParcelDelivered,
    OnParcelReturned,
  ],
})
export class EventsModule {}

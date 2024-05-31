import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { DeliveryPersonsRepository } from '@/domain/delivery/application/repositories/delivery-persons-repository'
import { AdminsRepository } from '@/domain/delivery/application/repositories/admins-repository'
import { AddresseesRepository } from '@/domain/delivery/application/repositories/addressees-repository'
import { AddressesRepository } from '@/domain/delivery/application/repositories/addresses-repository'
import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { PrismaDeliveryPersonsRepository } from './prisma/repositories/prisma-delivery-persons-repository'
import { PrismaAddresseesRepository } from './prisma/repositories/prisma-addressees-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaAddressesRepository } from './prisma/repositories/prisma-addresses-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaParcelsRepository } from './prisma/repositories/prisma-parcels-repository'

@Module({
  imports: [],
  exports: [
    PrismaService,
    DeliveryPersonsRepository,
    AdminsRepository,
    AddresseesRepository,
    AddressesRepository,
    AttachmentsRepository,
    ParcelsRepository,
  ],
  providers: [
    PrismaService,
    {
      provide: DeliveryPersonsRepository,
      useClass: PrismaDeliveryPersonsRepository,
    },
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    { provide: AddresseesRepository, useClass: PrismaAddresseesRepository },
    { provide: AddressesRepository, useClass: PrismaAddressesRepository },
    { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
    { provide: ParcelsRepository, useClass: PrismaParcelsRepository },
  ],
})
export class DatabaseModule {}

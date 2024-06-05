import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin-use-case'
import { AuthenticateDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/authenticate-delivery-person-use-case'
import { ChangeAdminPasswordUseCase } from '@/domain/delivery/application/use-cases/change-admin-password-use-case'
import { ChangeDeliveryPersonPasswordUseCase } from '@/domain/delivery/application/use-cases/change-delivery-person-password-use-case'
import { CreateAddresseeUseCase } from '@/domain/delivery/application/use-cases/create-addressee-use-case'
import { EditAdminUseCase } from '@/domain/delivery/application/use-cases/edit-admin-use-case'
import { EditDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/edit-delivery-person-use-case'
import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin-use-case'
import { RegisterDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/register-delivery-person-use-case'
import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateDeliveryPersonController } from './controllers/authenticate-delivery-person.controller'
import { ChangePasswordController } from './controllers/change-password.controller'
import { CreateAddresseeController } from './controllers/create-addressee.controller'
import { EditUserController } from './controllers/edit-user.controller'
import { RegisterUserController } from './controllers/register-user.controller'
import { EditAddresseeController } from './controllers/edit-addressee.controller'
import { EditAddresseeUseCase } from '@/domain/delivery/application/use-cases/edit-addressee-use-case'
import { DeleteAddresseeController } from './controllers/delete-addressee.controller'
import { DeleteAddresseeUseCase } from '@/domain/delivery/application/use-cases/delete-addressee-use-case'
import { CreateAddressController } from './controllers/create-address.controller'
import { CreateAddressUseCase } from '@/domain/delivery/application/use-cases/create-address-use-case'
import { EditAddressController } from './controllers/edit-address.controller'
import { EditAddressUseCase } from '@/domain/delivery/application/use-cases/edit-address-use-case'
import { DeleteAddressController } from './controllers/delete-address.controller'
import { DeleteAddressUseCase } from '@/domain/delivery/application/use-cases/delete-address-use-case'
import { StorageModule } from '../storage/storage.module'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { UploadAttachmentUseCase } from '@/domain/delivery/application/use-cases/upload-attachment-use-case'
import { CreateParcelController } from './controllers/create-parcel.controller'
import { CreateParcelUseCase } from '@/domain/delivery/application/use-cases/create-parcel-use-case'
import { EditParcelUseCase } from '@/domain/delivery/application/use-cases/edit-parcel-use-case'
import { EditParcelController } from './controllers/edit-parcel.controller'
import { DeleteParcelController } from './controllers/delete-parcel.controller'
import { DeleteParcelUseCase } from '@/domain/delivery/application/use-cases/delete-parcel-use-case'
import { FetchParcelsByDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/fetch-parcels-by-delivery-person-use-case'
import { FetchParcelsByDeliveryPersonController } from './controllers/fetch-parcels-by-delivery-person.controller'
import { FetchAvailableParcelsToTakeUseCase } from '@/domain/delivery/application/use-cases/fetch-available-parcels-to-take-use-case'
import { FetchAvailableParcelsController } from './controllers/fetch-available-parcels.controller'
import { FetchNearbyParcelsController } from './controllers/fetch-nearby-parcels.controller'
import { FetchNearbyParcelsUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-parcels-use-case'
import { MakeParcelAvailableController } from './controllers/make-parcel-available.controller'
import { MakeParcelAvailableUseCase } from '@/domain/delivery/application/use-cases/make-parcel-available-use-case'
import { TakeParcelUseCase } from '@/domain/delivery/application/use-cases/take-parcel-use-case'
import { TakeParcelController } from './controllers/take-parcel.controller'
import { DeliverParcelController } from './controllers/deliver-parcel.controller'
import { DeliverParcelUseCase } from '@/domain/delivery/application/use-cases/deliver-parcel-use-case'
import { ReturnParcelController } from './controllers/return-parcel.controller'
import { ReturnParcelUseCase } from '@/domain/delivery/application/use-cases/return-parcel-use-case'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  exports: [],
  controllers: [
    RegisterUserController,
    AuthenticateAdminController,
    AuthenticateDeliveryPersonController,
    EditUserController,
    ChangePasswordController,
    CreateAddresseeController,
    EditAddresseeController,
    DeleteAddresseeController,
    CreateAddressController,
    EditAddressController,
    DeleteAddressController,
    UploadAttachmentController,
    CreateParcelController,
    EditParcelController,
    DeleteParcelController,
    FetchParcelsByDeliveryPersonController,
    FetchAvailableParcelsController,
    FetchNearbyParcelsController,
    MakeParcelAvailableController,
    TakeParcelController,
    DeliverParcelController,
    ReturnParcelController,
  ],
  providers: [
    RegisterDeliveryPersonUseCase,
    RegisterAdminUseCase,
    AuthenticateAdminUseCase,
    AuthenticateDeliveryPersonUseCase,
    EditAdminUseCase,
    EditDeliveryPersonUseCase,
    ChangeAdminPasswordUseCase,
    ChangeDeliveryPersonPasswordUseCase,
    CreateAddresseeUseCase,
    EditAddresseeUseCase,
    DeleteAddresseeUseCase,
    CreateAddressUseCase,
    EditAddressUseCase,
    DeleteAddressUseCase,
    UploadAttachmentUseCase,
    CreateParcelUseCase,
    EditParcelUseCase,
    DeleteParcelUseCase,
    FetchParcelsByDeliveryPersonUseCase,
    FetchAvailableParcelsToTakeUseCase,
    FetchNearbyParcelsUseCase,
    MakeParcelAvailableUseCase,
    TakeParcelUseCase,
    DeliverParcelUseCase,
    ReturnParcelUseCase,
  ],
})
export class HttpModule {}

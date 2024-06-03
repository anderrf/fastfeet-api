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

@Module({
  imports: [DatabaseModule, CryptographyModule],
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
  ],
})
export class HttpModule {}

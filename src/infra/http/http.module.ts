import { Module } from '@nestjs/common'
import { RegisterUserController } from './controllers/register-user.controller'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/register-delivery-person-use-case'
import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin-use-case'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateDeliveryPersonController } from './controllers/authenticate-delivery-person.controller'
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin-use-case'
import { AuthenticateDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/authenticate-delivery-person-use-case'
import { EditAdminUseCase } from '@/domain/delivery/application/use-cases/edit-admin-use-case'
import { EditDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/edit-delivery-person-use-case'
import { EditUserController } from './controllers/edit-user.controller'
import { ChangePasswordController } from './controllers/change-password.controller'
import { ChangeAdminPasswordUseCase } from '@/domain/delivery/application/use-cases/change-admin-password-use-case'
import { ChangeDeliveryPersonPasswordUseCase } from '@/domain/delivery/application/use-cases/change-delivery-person-password-use-case'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  exports: [],
  controllers: [
    RegisterUserController,
    AuthenticateAdminController,
    AuthenticateDeliveryPersonController,
    EditUserController,
    ChangePasswordController,
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
  ],
})
export class HttpModule {}

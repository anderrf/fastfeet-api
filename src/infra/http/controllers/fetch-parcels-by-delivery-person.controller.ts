import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'

import { FetchParcelsByDeliveryPersonUseCase } from '../../../domain/delivery/application/use-cases/fetch-parcels-by-delivery-person-use-case'
import { ParcelPresenter } from '../presenters/parcel-presenter'

@Controller('parcels/fetch-by-delivery-person')
export class FetchParcelsByDeliveryPersonController {
  constructor(
    private fetchParcelsByDeliveryPersonUseCase: FetchParcelsByDeliveryPersonUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const { role, sub } = user
    if (role !== 'DELIVERY_PERSON') {
      throw new UnauthorizedException()
    }
    const result = await this.fetchParcelsByDeliveryPersonUseCase.execute({
      deliveryPersonId: sub,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { parcels } = result.value
    return { parcels: parcels.map(ParcelPresenter.toHTTP) }
  }
}

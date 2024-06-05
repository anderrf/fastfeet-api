import { FetchAvailableParcelsToTakeUseCase } from '@/domain/delivery/application/use-cases/fetch-available-parcels-to-take-use-case'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'

import { ParcelPresenter } from '../presenters/parcel-presenter'

@Controller('parcels/fetch-available')
export class FetchAvailableParcelsController {
  constructor(
    private fetchAvailableParcelsToTakeUseCase: FetchAvailableParcelsToTakeUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const { role } = user
    if (role !== 'DELIVERY_PERSON') {
      throw new UnauthorizedException()
    }
    const result = await this.fetchAvailableParcelsToTakeUseCase.execute()
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { parcels } = result.value
    return { parcels: parcels.map(ParcelPresenter.toHTTP) }
  }
}

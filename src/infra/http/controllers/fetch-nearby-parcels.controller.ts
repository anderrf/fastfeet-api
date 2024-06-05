import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'

import { FetchNearbyParcelsUseCase } from '../../../domain/delivery/application/use-cases/fetch-nearby-parcels-use-case'
import { ParcelPresenter } from '../presenters/parcel-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const fetchNearbyParcelsBodySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})
const fetchNearbyParcelsValidationPipe = new ZodValidationPipe(
  fetchNearbyParcelsBodySchema,
)
type FetchNearbyParcelsBodySchema = z.infer<typeof fetchNearbyParcelsBodySchema>

@Controller('parcels/fetch-nearby')
export class FetchNearbyParcelsController {
  constructor(private fetchNearbyParcelsUseCase: FetchNearbyParcelsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body(fetchNearbyParcelsValidationPipe) body: FetchNearbyParcelsBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { role, sub } = user
    if (role !== 'DELIVERY_PERSON') {
      throw new UnauthorizedException()
    }
    const { latitude, longitude } = body
    const result = await this.fetchNearbyParcelsUseCase.execute({
      deliveryPersonId: sub,
      latitude,
      longitude,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { parcels } = result.value
    return { parcels: parcels.map(ParcelPresenter.toHTTP) }
  }
}

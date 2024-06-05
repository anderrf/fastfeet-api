import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Parcel,
  ParcelProps,
} from '@/domain/delivery/enterprise/entities/parcel'
import { PrismaParcelMapper } from '@/infra/database/prisma/mappers/prisma-parcel-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeParcel(
  override: Partial<ParcelProps> = {},
  id?: UniqueEntityId,
) {
  const parcel = Parcel.create(
    {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      addressId: new UniqueEntityId(),
      addresseeId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
  return parcel
}

@Injectable()
export class ParcelFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaParcel(data: Partial<ParcelProps> = {}): Promise<Parcel> {
    const parcel = makeParcel(data)
    await this.prisma.parcel.create({
      data: PrismaParcelMapper.toPrisma(parcel),
    })
    return parcel
  }
}

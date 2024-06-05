import { ParcelsRepository } from '@/domain/delivery/application/repositories/parcels-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  Parcel,
  ParcelStatus,
} from '@/domain/delivery/enterprise/entities/parcel'
import { PrismaParcelMapper } from '../mappers/prisma-parcel-mapper'
import { Coordinate } from '@/domain/delivery/application/use-cases/utils/get-distance-between-coordinates'
import { Prisma, Parcel as PrismaParcel } from '@prisma/client'

@Injectable()
export class PrismaParcelsRepository implements ParcelsRepository {
  constructor(private prisma: PrismaService) {}

  async create(parcel: Parcel): Promise<void> {
    const data = PrismaParcelMapper.toPrisma(parcel)
    await this.prisma.parcel.create({ data })
  }

  async findById(id: string): Promise<Parcel | null> {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id },
    })
    if (!parcel) {
      return null
    }
    return PrismaParcelMapper.toDomain(parcel)
  }

  async save(parcel: Parcel): Promise<void> {
    const data = PrismaParcelMapper.toPrisma(parcel)
    await this.prisma.parcel.update({
      data,
      where: { id: data.id },
    })
  }

  async delete(parcel: Parcel): Promise<void> {
    const data = PrismaParcelMapper.toPrisma(parcel)
    await this.prisma.parcel.delete({
      where: { id: data.id },
    })
  }

  async findManyByAddresseeId(addresseeId: string): Promise<Parcel[]> {
    const parcels = await this.prisma.parcel.findMany({
      where: { addresseeId },
    })
    return parcels.map(PrismaParcelMapper.toDomain)
  }

  async findManyByAddressId(addressId: string): Promise<Parcel[]> {
    const parcels = await this.prisma.parcel.findMany({
      where: { addressId },
    })
    return parcels.map(PrismaParcelMapper.toDomain)
  }

  async findManyAvailable(): Promise<Parcel[]> {
    const parcels = await this.prisma.$queryRaw<PrismaParcel[]>`
    WITH available_parcels AS (
      SELECT *,
      GREATEST(
        COALESCE(ready_at, '1970-01-01'),
        COALESCE(taken_at, '1970-01-01'),
        COALESCE(delivered_at, '1970-01-01'),
        COALESCE(returned_at, '1970-01-01'),
        COALESCE(created_at, '1970-01-01')
      ) AS latest_date
      FROM parcels
    )
    SELECT *
    FROM available_parcels
    WHERE available_parcels.${Prisma.raw('ready_at')} = latest_date
  `
    return parcels.map(PrismaParcelMapper.toDomain)
  }

  async findManyByStatus(status: ParcelStatus): Promise<Parcel[]> {
    if (!ParcelStatus[status]) {
      throw new Error()
    }
    let field = 'created_at'
    switch (status) {
      case ParcelStatus.NEW:
        field = 'created_at'
        break
      case ParcelStatus.READY:
        field = 'ready_at'
        break
      case ParcelStatus.TAKEN:
        field = 'taken_at'
        break
      case ParcelStatus.DELIVERED:
        field = 'delivered_at'
        break
      case ParcelStatus.RETURNED:
        field = 'returned_at'
        break
    }
    const parcels = await this.prisma.$queryRaw<PrismaParcel[]>`
      WITH status_parcels AS (
        SELECT *,
        GREATEST(
          COALESCE(ready_at, '1970-01-01'),
          COALESCE(taken_at, '1970-01-01'),
          COALESCE(delivered_at, '1970-01-01'),
          COALESCE(returned_at, '1970-01-01'),
          COALESCE(created_at, '1970-01-01')
        ) AS latest_date
        FROM parcels
      )
      SELECT *
      FROM status_parcels
      WHERE status_parcels.${Prisma.raw(field)} = latest_date
    `
    return parcels.map(PrismaParcelMapper.toDomain)
  }

  async findManyByDeliveryPersonId(
    deliveryPersonId: string,
  ): Promise<Parcel[]> {
    const parcels = await this.prisma.parcel.findMany({
      where: { deliveredBy: deliveryPersonId },
    })
    return parcels.map(PrismaParcelMapper.toDomain)
  }

  async findManyNearbyDeliveryPerson(
    deliveryPersonId: string,
    { latitude, longitude }: Coordinate,
  ): Promise<Parcel[]> {
    const parcels = await this.prisma.$queryRaw<PrismaParcel[]>`
      WITH nearby_parcels AS (
        SELECT p.*,
        GREATEST(
          COALESCE(p.ready_at, '1970-01-01'),
          COALESCE(p.taken_at, '1970-01-01'),
          COALESCE(p.delivered_at, '1970-01-01'),
          COALESCE(p.returned_at, '1970-01-01'),
          COALESCE(p.created_at, '1970-01-01')
        ) AS latest_date
        FROM parcels p
        INNER JOIN addresses a
          ON p.address_id = a.id
        WHERE 
      ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( a.latitude ) ) * cos( radians( a.longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( a.latitude ) ) ) ) <= 10
      )
      SELECT *
      FROM nearby_parcels
      WHERE (
        nearby_parcels.ready_at = latest_date
        OR
        (
          nearby_parcels.returned_at <> latest_date
          AND
          nearby_parcels.delivered_by = ${deliveryPersonId}
        )
      )
    `
    return parcels.map(PrismaParcelMapper.toDomain)
  }
}

import { AddressesRepository } from '@/domain/delivery/application/repositories/addresses-repository'
import { Address } from '@/domain/delivery/enterprise/entities/address'
import { Injectable } from '@nestjs/common'

import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAddressesRepository implements AddressesRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address)
    await this.prisma.address.create({ data })
  }

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: { id },
    })
    if (!address) {
      return null
    }
    return PrismaAddressMapper.toDomain(address)
  }

  async save(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address)
    await this.prisma.address.update({
      data,
      where: { id: data.id },
    })
  }

  async delete(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address)
    await this.prisma.address.delete({ where: { id: data.id } })
  }

  async findManyByAddresseeId(addresseeId: string): Promise<Address[]> {
    const addressess = await this.prisma.address.findMany({
      where: { addresseeId },
    })
    return addressess.map(PrismaAddressMapper.toDomain)
  }

  async deleteManyByAddresseeId(addresseeId: string): Promise<void> {
    await this.prisma.address.deleteMany({ where: { addresseeId } })
  }
}

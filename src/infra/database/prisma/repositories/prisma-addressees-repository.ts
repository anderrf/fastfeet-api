import { AddresseesRepository } from '@/domain/delivery/application/repositories/addressees-repository'
import { Addressee } from '@/domain/delivery/enterprise/entities/addressee'
import { makeRegisterDocumentFromValue } from '@/domain/delivery/enterprise/entities/value-objects/register-document'
import { Injectable } from '@nestjs/common'

import { PrismaAddresseeMapper } from '../mappers/prisma-addressee-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAddresseesRepository implements AddresseesRepository {
  constructor(private prisma: PrismaService) {}

  async create(addressee: Addressee): Promise<void> {
    const data = PrismaAddresseeMapper.toPrisma(addressee)
    await this.prisma.addressee.create({ data })
  }

  async findByDocument(document: string): Promise<Addressee | null> {
    const addressee = await this.prisma.addressee.findUnique({
      where: {
        document: makeRegisterDocumentFromValue(document).toPlainValue(),
      },
    })
    if (!addressee) {
      return null
    }
    return PrismaAddresseeMapper.toDomain(addressee)
  }

  async findByEmail(email: string): Promise<Addressee | null> {
    const addressee = await this.prisma.addressee.findUnique({
      where: { email },
    })
    if (!addressee) {
      return null
    }
    return PrismaAddresseeMapper.toDomain(addressee)
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Addressee | null> {
    const addressee = await this.prisma.addressee.findUnique({
      where: { phoneNumber },
    })
    if (!addressee) {
      return null
    }
    return PrismaAddresseeMapper.toDomain(addressee)
  }

  async findById(id: string): Promise<Addressee | null> {
    const addressee = await this.prisma.addressee.findUnique({
      where: { id },
    })
    if (!addressee) {
      return null
    }
    return PrismaAddresseeMapper.toDomain(addressee)
  }

  async save(addressee: Addressee): Promise<void> {
    const data = PrismaAddresseeMapper.toPrisma(addressee)
    await this.prisma.addressee.update({
      data,
      where: { id: data.id },
    })
  }

  async delete(addressee: Addressee): Promise<void> {
    const data = PrismaAddresseeMapper.toPrisma(addressee)
    await this.prisma.addressee.delete({ where: { id: data.id } })
  }
}

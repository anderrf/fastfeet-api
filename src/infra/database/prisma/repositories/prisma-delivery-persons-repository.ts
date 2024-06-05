import { DeliveryPersonsRepository } from '@/domain/delivery/application/repositories/delivery-persons-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person'
import { PrismaDeliveryPersonMapper } from '../mappers/prisma-delivery-person-mapper'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'

@Injectable()
export class PrismaDeliveryPersonsRepository
  implements DeliveryPersonsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(deliveryperson: DeliveryPerson): Promise<void> {
    const data = PrismaDeliveryPersonMapper.toPrisma(deliveryperson)
    await this.prisma.user.create({ data })
  }

  async findByCpf(cpf: string): Promise<DeliveryPerson | null> {
    const deliveryperson = await this.prisma.user.findUnique({
      where: {
        cpf: Cpf.createFromText(cpf).toPlainValue(),
        role: 'DELIVERY_PERSON',
      },
    })
    if (!deliveryperson) {
      return null
    }
    return PrismaDeliveryPersonMapper.toDomain(deliveryperson)
  }

  async findByEmail(email: string): Promise<DeliveryPerson | null> {
    const deliveryperson = await this.prisma.user.findUnique({
      where: { email, role: 'DELIVERY_PERSON' },
    })
    if (!deliveryperson) {
      return null
    }
    return PrismaDeliveryPersonMapper.toDomain(deliveryperson)
  }

  async findByPhoneNumber(phoneNumber: string): Promise<DeliveryPerson | null> {
    const deliveryperson = await this.prisma.user.findUnique({
      where: { phoneNumber, role: 'DELIVERY_PERSON' },
    })
    if (!deliveryperson) {
      return null
    }
    return PrismaDeliveryPersonMapper.toDomain(deliveryperson)
  }

  async findById(id: string): Promise<DeliveryPerson | null> {
    const deliveryperson = await this.prisma.user.findUnique({
      where: { id, role: 'DELIVERY_PERSON' },
    })
    if (!deliveryperson) {
      return null
    }
    return PrismaDeliveryPersonMapper.toDomain(deliveryperson)
  }

  async save(deliveryperson: DeliveryPerson): Promise<void> {
    const data = PrismaDeliveryPersonMapper.toPrisma(deliveryperson)
    await this.prisma.user.update({
      data,
      where: { id: data.id, role: 'DELIVERY_PERSON' },
    })
  }

  async delete(deliveryperson: DeliveryPerson): Promise<void> {
    const data = PrismaDeliveryPersonMapper.toPrisma(deliveryperson)
    await this.prisma.user.delete({
      where: { id: data.id, role: 'DELIVERY_PERSON' },
    })
  }
}

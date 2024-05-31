import { AdminsRepository } from '@/domain/delivery/application/repositories/admins-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { Cpf } from '@/domain/delivery/enterprise/entities/value-objects/cpf'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)
    await this.prisma.user.create({ data })
  }

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: { cpf: Cpf.createFromText(cpf).toPlainValue(), role: 'ADMIN' },
    })
    if (!admin) {
      return null
    }
    return PrismaAdminMapper.toDomain(admin)
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: { email, role: 'ADMIN' },
    })
    if (!admin) {
      return null
    }
    return PrismaAdminMapper.toDomain(admin)
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: { phoneNumber, role: 'ADMIN' },
    })
    if (!admin) {
      return null
    }
    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: { id, role: 'ADMIN' },
    })
    if (!admin) {
      return null
    }
    return PrismaAdminMapper.toDomain(admin)
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)
    await this.prisma.user.update({
      data,
      where: { id: data.id, role: 'ADMIN' },
    })
  }

  async delete(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)
    await this.prisma.user.delete({ where: { id: data.id, role: 'ADMIN' } })
  }
}

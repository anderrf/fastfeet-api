import { AdminsRepository } from '@/domain/delivery/application/repositories/admins-repository'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = this.items.find((admin) => admin.cpf.value === cpf)
    return admin ?? null
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = this.items.find((admin) => admin.email === email)
    return admin ?? null
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Admin | null> {
    const admin = this.items.find((admin) => admin.phoneNumber === phoneNumber)
    return admin ?? null
  }

  async save(admin: Admin): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(admin.id))
    this.items[itemIndex] = admin
  }

  async delete(admin: Admin): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(admin.id))
    this.items.splice(itemIndex, 1)
  }
}

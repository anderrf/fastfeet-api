import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract create(admin: Admin): Promise<void>
  abstract findByCpf(cpf: string): Promise<Admin | null>
  abstract findByEmail(email: string): Promise<Admin | null>
  abstract findByPhoneNumber(phoneNumber: string): Promise<Admin | null>
  abstract findById(id: string): Promise<Admin | null>
  abstract save(admin: Admin): Promise<void>
  abstract delete(admin: Admin): Promise<void>
}

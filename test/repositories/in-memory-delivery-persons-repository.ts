import { DeliveryPersonsRepository } from '@/domain/delivery/application/repositories/delivery-persons-repository'
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person'

export class InMemoryDeliveryPersonsRepository
  implements DeliveryPersonsRepository
{
  public items: DeliveryPerson[] = []

  async create(deliveryperson: DeliveryPerson): Promise<void> {
    this.items.push(deliveryperson)
  }

  async findByCpf(cpf: string): Promise<DeliveryPerson | null> {
    const deliveryperson = this.items.find(
      (deliveryperson) => deliveryperson.cpf.value === cpf,
    )
    return deliveryperson ?? null
  }

  async findByEmail(email: string): Promise<DeliveryPerson | null> {
    const deliveryperson = this.items.find(
      (deliveryperson) => deliveryperson.email === email,
    )
    return deliveryperson ?? null
  }

  async findByPhoneNumber(phoneNumber: string): Promise<DeliveryPerson | null> {
    const deliveryperson = this.items.find(
      (deliveryperson) => deliveryperson.phoneNumber === phoneNumber,
    )
    return deliveryperson ?? null
  }

  async save(deliveryperson: DeliveryPerson): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(deliveryperson.id),
    )
    this.items[itemIndex] = deliveryperson
  }

  async delete(deliveryperson: DeliveryPerson): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(deliveryperson.id),
    )
    this.items.splice(itemIndex, 1)
  }
}

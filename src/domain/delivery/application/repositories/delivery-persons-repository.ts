import { DeliveryPerson } from '../../enterprise/entities/delivery-person'

export abstract class DeliveryPersonsRepository {
  abstract create(deliveryPerson: DeliveryPerson): Promise<void>
  abstract save(deliveryPerson: DeliveryPerson): Promise<void>
  abstract delete(deliveryPerson: DeliveryPerson): Promise<void>
  abstract findByCpf(cpf: string): Promise<DeliveryPerson | null>
  abstract findByEmail(email: string): Promise<DeliveryPerson | null>
  abstract findById(id: string): Promise<DeliveryPerson | null>
  abstract findByPhoneNumber(
    phoneNumber: string,
  ): Promise<DeliveryPerson | null>
}

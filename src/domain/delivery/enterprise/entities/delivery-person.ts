import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Cpf } from './value-objects/cpf'

export interface DeliveryPersonProps {
  name: string
  email: string
  phoneNumber: string
  cpf: Cpf
  password
  createdAt: Date
}

export class DeliveryPerson extends Entity<DeliveryPersonProps> {
  static create(
    props: Optional<DeliveryPersonProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new DeliveryPerson(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  public get name(): string {
    return this.props.name
  }

  public set name(name: string) {
    this.props.name = name
  }

  public get email(): string {
    return this.props.email
  }

  public set email(email: string) {
    this.props.email = email
  }

  public get phoneNumber(): string {
    return this.props.phoneNumber
  }

  public set phoneNumber(phoneNumber: string) {
    this.props.phoneNumber = phoneNumber
  }

  public get cpf(): Cpf {
    return this.props.cpf
  }

  public set cpf(cpf: Cpf) {
    this.props.cpf = cpf
  }

  public get password(): string {
    return this.props.password
  }

  public set password(password: string) {
    this.props.password = password
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }
}

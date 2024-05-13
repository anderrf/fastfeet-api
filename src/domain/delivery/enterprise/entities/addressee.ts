import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AddresseeProps {
  name: string
  email: string
  phoneNumber: string
  document: string
  address: string
  createdAt: Date
}

export class Addressee extends Entity<AddresseeProps> {
  static create(
    props: Optional<AddresseeProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new Addressee(
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

  public get document(): string {
    return this.props.document
  }

  public set document(document: string) {
    this.props.document = document
  }

  public get address(): string {
    return this.props.address
  }

  public set address(address: string) {
    this.props.address = address
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }
}

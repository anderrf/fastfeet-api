import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ZipCode } from './value-objects/zip-code'

export interface AddressProps {
  street: string
  number: number
  district: string
  zipCode: ZipCode
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
  addresseeId: UniqueEntityId
}

export class Address extends Entity<AddressProps> {
  static create(props: AddressProps, id?: UniqueEntityId) {
    return new Address({ ...props }, id)
  }

  public get street(): string {
    return this.props.street
  }

  public set street(street: string) {
    this.props.street = street
  }

  public get number(): number {
    return this.props.number
  }

  public set number(number: number) {
    this.props.number = number
  }

  public get district(): string {
    return this.props.district
  }

  public set district(district: string) {
    this.props.district = district
  }

  public get zipCode(): ZipCode {
    return this.props.zipCode
  }

  public set zipCode(zipCode: ZipCode) {
    this.props.zipCode = zipCode
  }

  public get city(): string {
    return this.props.city
  }

  public set city(city: string) {
    this.props.city = city
  }

  public get state(): string {
    return this.props.state
  }

  public set state(state: string) {
    this.props.state = state
  }

  public get country(): string {
    return this.props.country
  }

  public set country(country: string) {
    this.props.country = country
  }

  public get latitude(): number {
    return this.props.latitude
  }

  public set latitude(latitude: number) {
    this.props.latitude = latitude
  }

  public get longitude(): number {
    return this.props.longitude
  }

  public set longitude(longitude: number) {
    this.props.longitude = longitude
  }

  public get addresseeId(): UniqueEntityId {
    return this.props.addresseeId
  }
}

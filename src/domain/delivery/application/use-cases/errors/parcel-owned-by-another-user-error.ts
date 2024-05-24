import { UseCaseError } from '@/domain/delivery/enterprise/errors/use-case-error'

export class ParcelOwnedByAnotherUserError
  extends Error
  implements UseCaseError
{
  constructor(parcelId: string) {
    super(`Parcel with id "${parcelId}" is already taken by another user`)
  }
}

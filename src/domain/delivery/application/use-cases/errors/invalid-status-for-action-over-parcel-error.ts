import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidStatusForActionOverParcelError
  extends Error
  implements UseCaseError
{
  constructor(status: string) {
    super(`Parcel status should be of status "${status}" for this action`)
  }
}

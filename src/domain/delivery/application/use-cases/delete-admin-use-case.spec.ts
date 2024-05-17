import { makeAdmin } from 'test/factories/make-admin-factory'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'

import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { DeleteAdminUseCase } from './delete-admin-use-case'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: DeleteAdminUseCase

describe('Delete Admin Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new DeleteAdminUseCase(inMemoryAdminsRepository)
  })

  it('should be able to delete an admin', async () => {
    const admin = makeAdmin({
      name: 'Anderson Farias',
      cpf: Cpf.createFromText('654.039.990-19'),
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    await inMemoryAdminsRepository.create(admin)
    const result = await sut.execute({
      cpf: '654.039.990-19',
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a nonexistent admin', async () => {
    const result = await sut.execute({
      cpf: '654.039.990-19',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

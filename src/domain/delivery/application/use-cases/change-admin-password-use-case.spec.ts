import { makeAdmin } from 'test/factories/make-admin-factory'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'

import { FakeHasher } from '../../../../../test/cryptography/fake-hasher'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { ChangeAdminPasswordUseCase } from './change-admin-password-use-case'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: ChangeAdminPasswordUseCase

describe('Cange Admin Password Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeAdminPasswordUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it(`should be able to change an admin's pasword`, async () => {
    const admin = makeAdmin({
      name: 'Anderson Farias',
      cpf: Cpf.createFromText('654.039.990-19'),
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    await inMemoryAdminsRepository.create(admin)
    const result = await sut.execute({
      adminId: admin.id.toString(),
      password: 'anderson@321',
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].password).toEqual(
      await fakeHasher.hash('anderson@321'),
    )
  })
})

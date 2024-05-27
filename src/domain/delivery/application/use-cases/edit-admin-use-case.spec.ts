import { FakeHasher } from './../../../../../test/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { EditAdminUseCase } from './edit-admin-use-case'
import { makeAdmin } from 'test/factories/make-admin-factory'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: EditAdminUseCase

describe('Edit Admin Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new EditAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to edit an admin', async () => {
    const admin = makeAdmin({
      name: 'Anderson Farias',
      cpf: Cpf.createFromText('654.039.990-19'),
      email: 'anderson@test.com',
      password: 'anderson@123',
      phoneNumber: '551399998888',
    })
    await inMemoryAdminsRepository.create(admin)
    const result = await sut.execute({
      name: 'Anderson Rocha',
      cpf: '654.039.990-19',
      email: 'anderson@teste.com',
      phoneNumber: '551399998888',
      adminId: admin.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        admin: expect.objectContaining({
          name: 'Anderson Rocha',
          email: 'anderson@teste.com',
        }),
      }),
    )
  })
})

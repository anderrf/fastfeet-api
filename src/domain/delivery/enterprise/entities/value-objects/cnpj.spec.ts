import { Cnpj } from './cnpj'

describe('CNPJ', () => {
  it('should create valid CNPJs', async () => {
    const plainCnpj = '11222333000181'
    const maskedCnpj = '87.464.694/0001-04'
    const plainResult = Cnpj.createFromText(plainCnpj)
    const maskedResult = Cnpj.createFromText(maskedCnpj)
    expect(plainResult.isValid()).toBe(true)
    expect(maskedResult.isValid()).toBe(true)
  })

  it('should set created CNPJs as invalid', async () => {
    const plainCnpj = '11222333000125'
    const maskedCnpj = '87.464.694/0001-14'
    const plainResult = Cnpj.createFromText(plainCnpj)
    const maskedResult = Cnpj.createFromText(maskedCnpj)
    expect(plainResult.isValid()).toBe(false)
    expect(maskedResult.isValid()).toBe(false)
  })
})

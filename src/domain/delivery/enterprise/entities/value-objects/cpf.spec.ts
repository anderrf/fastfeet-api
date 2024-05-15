import { Cpf } from './cpf'

describe('CPF', () => {
  it('should create valid CPFs', async () => {
    const plainCpf = '11122233396'
    const maskedCpf = '654.039.990-19'
    const plainResult = Cpf.createFromText(plainCpf)
    const maskedResult = Cpf.createFromText(maskedCpf)
    expect(plainResult.isValid()).toBe(true)
    expect(maskedResult.isValid()).toBe(true)
  })

  it('should set created CPFs as invalid', async () => {
    const plainCpf = '11122233312'
    const maskedCpf = '654.039.990-15'
    const plainResult = Cpf.createFromText(plainCpf)
    const maskedResult = Cpf.createFromText(maskedCpf)
    expect(plainResult.isValid()).toBe(false)
    expect(maskedResult.isValid()).toBe(false)
  })
})

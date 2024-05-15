export class Cpf {
  public value: string

  private readonly cpfRegex = /\d{3}\.\d{3}\.\d{3}-\d{2}/

  private constructor(value: string) {
    this.value = value
  }

  static createFromText(text: string) {
    text = text.trim().replaceAll('.', '').replace('-', '').substring(0, 11)
    text = `${text.substring(0, 3)}.${text.substring(3, 6)}.${text.substring(6, 9)}-${text.substring(9, 11)}`
    const cpfRegex = /\d{3}\.\d{3}\.\d{3}-\d{2}/
    const cpfPattern = '$1.$2.$3-$4'
    text.normalize('NFKD').trim().replace(cpfRegex, cpfPattern)
    return new Cpf(text)
  }

  toPlainValue(): string {
    return this.value.replaceAll('.', '').replace('-', '')
  }

  toMaskedValue(): string {
    return this.value
  }

  static create(value: string) {
    return new Cpf(value)
  }

  isValid(): boolean {
    const cpf = this.value.replaceAll('.', '').replace('-', '').trim()
    if (!cpf.length) {
      return false
    }
    const initialChar = cpf[0]
    if (cpf.split('').every((char) => char === initialChar)) {
      return false
    }
    if (!cpf.endsWith(Cpf.getValidationDigits(cpf))) {
      return false
    }
    return this.cpfRegex.test(this.value)
  }

  static getValidationDigits(cpf: string): string {
    cpf = cpf.replaceAll('.', '').replace('-', '').substring(0, 9)
    let digitsToValidate = cpf.split('').map((digit) => Number.parseInt(digit))
    let validationMultipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    let sum = 0
    for (let i = 0; i < digitsToValidate.length; i++) {
      sum += digitsToValidate[i] * validationMultipliers[i]
    }
    let firstVal = (sum * 10) % 11
    if (firstVal === 10) firstVal = 0
    sum = 0
    validationMultipliers = [11, ...validationMultipliers]
    digitsToValidate = [...digitsToValidate, firstVal]
    for (let i = 0; i < digitsToValidate.length; i++) {
      sum += digitsToValidate[i] * validationMultipliers[i]
    }
    let secondVal = (sum * 10) % 11
    if (secondVal === 10) secondVal = 0
    return `${firstVal}${secondVal}`
  }
}

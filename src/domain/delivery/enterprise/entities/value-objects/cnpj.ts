import { RegisterDocument } from './register-document'

export class Cnpj implements RegisterDocument {
  public value: string

  private readonly cnpjRegex = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/

  private constructor(value: string) {
    this.value = value
  }

  static createFromText(text: string) {
    text = text
      .trim()
      .replaceAll('.', '')
      .replace('-', '')
      .replace('/', '')
      .substring(0, 14)
    text = `${text.substring(0, 2)}.${text.substring(2, 5)}.${text.substring(5, 8)}/${text.substring(8, 12)}-${text.substring(12, 14)}`
    const cnpjRegex = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/
    const cnpjPattern = '$1.$2.$3/$4-$5'
    text.normalize('NFKD').trim().replace(cnpjRegex, cnpjPattern)
    return new Cnpj(text)
  }

  static create(value: string) {
    return new Cnpj(value)
  }

  isValid(): boolean {
    const cnpj = this.value
      .replaceAll('.', '')
      .replace('-', '')
      .replace('/', '')
      .trim()
    if (!cnpj.length) {
      return false
    }
    const initialChar = cnpj[0]
    if (cnpj.split('').every((char) => char === initialChar)) {
      return false
    }
    if (!cnpj.endsWith(Cnpj.getValidationDigits(cnpj))) {
      return false
    }
    return this.cnpjRegex.test(this.value)
  }

  static getValidationDigits(cnpj: string): string {
    cnpj = cnpj
      .replaceAll('.', '')
      .replace('-', '')
      .replace('/', '')
      .substring(0, 12)
    let digitsToValidate = cnpj.split('').map((digit) => Number.parseInt(digit))
    let validationMultipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < digitsToValidate.length; i++) {
      sum += digitsToValidate[i] * validationMultipliers[i]
    }
    let firstVal = sum % 11
    if (firstVal < 2) {
      firstVal = 0
    } else {
      firstVal = 11 - firstVal
    }
    sum = 0
    validationMultipliers = [6, ...validationMultipliers]
    digitsToValidate = [...digitsToValidate, firstVal]
    for (let i = 0; i < digitsToValidate.length; i++) {
      sum += digitsToValidate[i] * validationMultipliers[i]
    }
    let secondVal = sum % 11
    if (secondVal < 2) {
      secondVal = 0
    } else {
      secondVal = 11 - secondVal
    }
    return `${firstVal}${secondVal}`
  }

  toPlainValue(): string {
    return this.value.replaceAll('.', '').replace('-', '').replace('/', '')
  }

  toMaskedValue(): string {
    return this.value
  }
}

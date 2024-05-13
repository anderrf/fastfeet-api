export class Cpf {
  public value: string

  private readonly cpfRegex = /\d{3}\.\d{3}\.\d{3}-\d{2}/

  private constructor(value: string) {
    this.value = value
  }

  static createFromText(text: string) {
    const cpfRegex = /\d{3}\.\d{3}\.\d{3}-\d{2}/
    const cpfPattern = '$1.$2.$3-$4'
    const cpfText = text.normalize('NFKD').trim().replace(cpfRegex, cpfPattern)
    return new Cpf(cpfText)
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
    return this.cpfRegex.test(this.value)
  }
}

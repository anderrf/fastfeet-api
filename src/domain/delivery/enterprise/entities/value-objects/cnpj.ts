export class Cnpj {
  public value: string

  private readonly cnpjRegex = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/

  private constructor(value: string) {
    this.value = value
  }

  static createFromText(text: string) {
    const cnpjRegex = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/
    const cnpjPattern = '$1.$2.$3/$4-$5'
    const cnpjText = text
      .normalize('NFKD')
      .trim()
      .replace(cnpjRegex, cnpjPattern)
    return new Cnpj(cnpjText)
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
    return this.cnpjRegex.test(this.value)
  }
}

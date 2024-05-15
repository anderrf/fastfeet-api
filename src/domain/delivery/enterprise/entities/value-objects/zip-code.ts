export class ZipCode {
  public value: string

  private readonly zipCodeRegex = /\d{5}-\d{3}/

  private constructor(value: string) {
    this.value = value
  }

  /**
   * Receives a string and normalize it as a slug
   * Exemple: "An example title" => "an-example-title"
   * @param text (string)
   */
  static createFromText(text: string) {
    const zipCodeRegex = /\d{5}-\d{3}/
    const zipCodePattern = '$1-$2'
    text.normalize('NFKD').trim().replace(zipCodeRegex, zipCodePattern)
    return new ZipCode(text)
  }

  static create(value: string) {
    return new ZipCode(value)
  }

  isValid(): boolean {
    return this.zipCodeRegex.test(this.value)
  }
}

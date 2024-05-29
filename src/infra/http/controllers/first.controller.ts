import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller('/first')
export class FirstController {
  @Get()
  @HttpCode(200)
  async handle() {
    return 'hello'
  }
}

import { Module } from '@nestjs/common'
import { FirstController } from './controllers/first.controller'

@Module({
  imports: [],
  exports: [],
  controllers: [FirstController],
  providers: [],
})
export class HttpModule {}

import { Module } from '@nestjs/common'
import { FirstController } from './controllers/first.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  exports: [],
  controllers: [FirstController],
  providers: [],
})
export class HttpModule {}

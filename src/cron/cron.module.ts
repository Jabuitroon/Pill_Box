import { Module } from '@nestjs/common'
import { CronController } from './cron.controller'
import { ReminderModule } from '../reminder/reminder.module'

@Module({
  controllers: [CronController],
  imports: [ReminderModule]
})
export class CronModule {}

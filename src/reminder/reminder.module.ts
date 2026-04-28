import { Module } from '@nestjs/common'
import { ReminderService } from './reminder.service'
import { WhatsappModule } from '../whatsapp/whatsapp.module'
import { ReminderController } from './reminder.controller'

@Module({
  imports: [WhatsappModule],
  providers: [ReminderService],
  controllers: [ReminderController]
})
export class ReminderModule {}

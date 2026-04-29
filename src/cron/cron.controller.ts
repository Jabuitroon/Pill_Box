import { Controller, Get } from '@nestjs/common'
import { ReminderService } from '../reminder/reminder.service'
import { ConfigService } from '@nestjs/config'

@Controller('cron')
export class CronController {
  constructor(
    private readonly reminderService: ReminderService,
    private configService: ConfigService
  ) {}

  @Get('reminders')
  async runReminders() {
    return this.reminderService.handleReminder()
  }
}

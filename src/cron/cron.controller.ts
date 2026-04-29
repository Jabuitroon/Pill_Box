import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common'
import { ReminderService } from '../reminder/reminder.service'

@Controller('cron')
export class CronController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get('reminders')
  async runReminders(@Headers('authorization') auth: string) {
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new UnauthorizedException()
    }

    return this.reminderService.handleReminder()
  }
}

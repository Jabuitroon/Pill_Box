import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common'
import { ReminderService } from '../reminder/reminder.service'
import { ConfigService } from '@nestjs/config'

@Controller('cron')
export class CronController {
  constructor(
    private readonly reminderService: ReminderService,
    private configService: ConfigService
  ) {}

  @Get('reminders')
  async runReminders(@Headers('authorization') auth: string) {
    const secret = this.configService.get<string>('CRON_SECRET')

    if (auth !== `Bearer ${secret}`) {
      throw new UnauthorizedException()
    }

    return this.reminderService.handleReminder()
  }
}

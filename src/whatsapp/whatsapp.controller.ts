import { Controller, Post, Body } from '@nestjs/common'
import { WhatsappService } from './whatsapp.service'

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send-template')
  async sendTemplate(
    @Body('to') to: string,
    @Body('template') template: string
  ) {
    return this.whatsappService.sendTemplateMessage(to, template)
  }
}

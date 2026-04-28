import { Controller, Post, Body } from '@nestjs/common'
import { WhatsappService } from './whatsapp.service'

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send-template-params')
  async sendTemplateWithParams(
    @Body('to') to: string,
    @Body('template') template: string,
    @Body('params') params: string[]
  ) {
    return this.whatsappService.sendTemplateMessageWithParams(
      to,
      template,
      params
    )
  }
}

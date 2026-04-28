import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class WhatsappService {
  private readonly apiUrl: string
  private readonly token: string
  private readonly phoneNumberId: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.token = this.configService.getOrThrow<string>('WHATSAPP_TOKEN')
    this.phoneNumberId =
      this.configService.getOrThrow<string>('WHATSAPP_PHONE_ID')

    this.apiUrl = `https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`
  }

  async sendTemplateMessage(to: string, templateName: string) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en_US' }
        }
      }

      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        })
      )

      return response.data
    } catch (error) {
      console.error(JSON.stringify(error?.response?.data, null, 2))
      throw new InternalServerErrorException(
        'Error enviando mensaje de WhatsApp'
      )
    }
  }
}

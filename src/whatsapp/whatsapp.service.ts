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

  async sendTemplateMessageWithParams(
    to: string,
    templateName: string,
    params: string[]
  ) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'es_CO'
          },
          components: [
            {
              type: 'body',
              parameters: params.map((param) => ({
                type: 'text',
                text: param
              }))
            }
          ]
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
      console.error(error?.response?.data || error.message)
      throw new InternalServerErrorException(
        'Error enviando mensaje con variables'
      )
    }
  }
}

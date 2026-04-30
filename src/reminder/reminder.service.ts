import { Injectable, NotFoundException } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { WhatsappService } from '../whatsapp/whatsapp.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ReminderService {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly prisma: PrismaService
  ) {}

  // Ejemplo: cada minuto (para pruebas)
  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminder() {
    console.log('⏰ Verificando recordatorios...')

    const now = new Date()

    const colombiaTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Bogota' })
    )

    const hours = colombiaTime.getHours().toString().padStart(2, '0')
    const minutes = colombiaTime.getMinutes().toString().padStart(2, '0')

    const currentTime = `${hours}:${minutes}`

    const reminders = await this.prisma.reminder.findMany({
      where: {
        scheduledTime: currentTime,
        sent: false
      },
      include: {
        prescription: {
          include: {
            patient: true,
            pill: true
          }
        }
      }
    })

    console.log(`📦 Recordatorios encontrados: ${reminders.length}`)

    for (const r of reminders) {
      console.log(r.prescription)
      const { patient, pill } = r.prescription

      if (!patient.phone) continue

      await this.whatsappService.sendTemplateMessageWithParams(
        patient.phone,
        'hello_world',
        [
          patient.name,
          'momento de tomar tus medicamentos para la presión arterial:',
          pill.name,
          r.scheduledTime
        ]
      )

      await this.prisma.reminder.update({
        where: { reminder_id: r.reminder_id },
        data: {
          sent: true,
          sentAt: new Date()
        }
      })
    }
  }

  create(data: { prescriptionId: string; scheduledTime: string }) {
    return this.prisma.reminder.create({ data })
  }

  async createBulk(prescriptionId: string, times: string[]) {
    return await this.prisma.reminder.createMany({
      data: times.map((time) => ({
        prescriptionId,
        scheduledTime: time
      }))
    })
  }

  findAll() {
    return this.prisma.reminder.findMany({
      include: {
        prescription: {
          include: {
            patient: true,
            pill: true
          }
        }
      }
    })
  }

  findByPrescription(prescriptionId: string) {
    return this.prisma.reminder.findMany({
      where: { prescriptionId }
    })
  }

  findPendingByTime(time: string) {
    return this.prisma.reminder.findMany({
      where: {
        scheduledTime: time,
        sent: false
      },
      include: {
        prescription: {
          include: {
            patient: true,
            pill: true
          }
        }
      }
    })
  }

  markAsSent(id: string) {
    return this.prisma.reminder.update({
      where: { reminder_id: id },
      data: {
        sent: true,
        sentAt: new Date()
      }
    })
  }

  // 🗑️ Eliminar uno
  async deleteOne(id: string) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { reminder_id: id }
    })

    if (!reminder) {
      throw new NotFoundException('Reminder no encontrado')
    }

    return this.prisma.reminder.delete({
      where: { reminder_id: id }
    })
  }

  // 🔥 Eliminar todos
  deleteAll() {
    return this.prisma.reminder.deleteMany()
  }

  // 🧠 Eliminar por prescription
  deleteByPrescription(prescriptionId: string) {
    return this.prisma.reminder.deleteMany({
      where: { prescriptionId }
    })
  }
}

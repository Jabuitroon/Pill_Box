import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common'
import { ReminderService } from './reminder.service'

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  // ✅ Crear un recordatorio
  @Post()
  createReminder(
    @Body('prescriptionId') prescriptionId: string,
    @Body('scheduledTime') scheduledTime: string
  ) {
    return this.reminderService.create({
      prescriptionId,
      scheduledTime
    })
  }

  // 🔥 Crear múltiples recordatorios (muy útil)
  @Post('bulk')
  async createBulk(
    @Body('prescriptionId') prescriptionId: string,
    @Body('times') times: string[]
  ) {
    return this.reminderService.createBulk(prescriptionId, times)
  }

  // 📄 Obtener todos los recordatorios
  @Get()
  findAll() {
    return this.reminderService.findAll()
  }

  // 📄 Obtener recordatorios por prescription
  @Get('prescription/:id')
  findByPrescription(@Param('id') id: string) {
    return this.reminderService.findByPrescription(id)
  }

  // 📄 Obtener recordatorios pendientes por hora (para cron)
  @Get('pending/:time')
  findPending(@Param('time') time: string) {
    return this.reminderService.findPendingByTime(time)
  }

  // ✅ Marcar como enviado
  @Patch(':id/sent')
  markAsSent(@Param('id') id: string) {
    return this.reminderService.markAsSent(id)
  }

  // 🗑️ Eliminar uno
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.reminderService.deleteOne(id)
  }

  // 🔥 Eliminar todos
  @Delete()
  deleteAll() {
    return this.reminderService.deleteAll()
  }

  // 🧠 Eliminar todos por prescription (MUY útil)
  @Delete('prescription/:id')
  deleteByPrescription(@Param('id') id: string) {
    return this.reminderService.deleteByPrescription(id)
  }
}

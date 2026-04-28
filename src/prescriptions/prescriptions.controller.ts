import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe
} from '@nestjs/common'
import { PrescriptionsService } from './prescriptions.service'
import { CreatePrescriptionDto } from './dto/create-prescription.dto'
import { UpdatePrescriptionDto } from './dto/update-prescription.dto'

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  // El Fisio crea la receta
  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto)
  }

  // Obtener todas las recetas de un paciente específico
  @Get('patient/:patientId')
  findAllByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.prescriptionsService.findAllByPatient(patientId)
  }

  // Obtener una receta única por ID
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.findOne(id)
  }

  // EL PUNTO CLAVE: El Fisio edita la hora (intakeTime) o cualquier dato
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto
  ) {
    return this.prescriptionsService.update(id, updatePrescriptionDto)
  }

  // Eliminar receta
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.remove(id)
  }
}

import { PartialType } from '@nestjs/mapped-types'
import { CreatePrescriptionDto } from './create-prescription.dto'
import { IsOptional, IsBoolean } from 'class-validator'

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean // Permite pausar los recordatorios de WhatsApp sin borrar la receta
}

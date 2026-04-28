import { IsString, IsUUID, IsEnum, IsInt, Min, Matches } from 'class-validator'
import { TimeOfDay } from '../../generated/prisma/client'

export class CreatePrescriptionDto {
  @IsUUID()
  patientId!: string

  @IsUUID()
  pillId!: string

  @IsEnum(TimeOfDay)
  schedule!: TimeOfDay

  @IsInt()
  @Min(1)
  timesPerDay!: number

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe tener el formato HH:mm (24h)'
  })
  intakeTime!: string // Ejemplo: "08:30"
}

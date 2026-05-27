// src/users/dto/create-user.dto.ts
import {
  IsString,
  MinLength,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsPhoneNumber,
  IsUUID
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '../../generated/prisma/client'

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Carlos',
    minLength: 2,
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Rodríguez',
    minLength: 2,
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName!: string

  @ApiProperty({
    description:
      'Correo electrónico único del usuario (se normaliza a minúsculas)',
    example: 'carlos.rodriguez@email.com',
    format: 'email',
    type: String
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email!: string

  @ApiProperty({
    description: 'Contraseña del usuario. Mínimo 10 caracteres.',
    example: 'MiPassword123!',
    minLength: 10,
    type: String,
    format: 'password'
  })
  @IsString()
  @MinLength(10)
  password!: string

  @ApiProperty({
    description: 'Número de teléfono en formato internacional (E.164)',
    example: '+573001234567',
    minLength: 10,
    type: String
  })
  @IsPhoneNumber()
  @MinLength(10)
  phone!: string

  @ApiPropertyOptional({
    description:
      'Rol del usuario en el sistema. Si no se especifica, se asigna PATIENT por defecto (definido en Prisma).',
    enum: UserRole,
    example: UserRole.PATIENT,
    default: 'PATIENT'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  @ApiPropertyOptional({
    description:
      'UUID del fisioterapeuta asignado. Solo aplica cuando el rol es PATIENT. El fisioterapeuta debe existir y tener rol PHYSIOTHERAPIST.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    type: String
  })
  @IsUUID()
  @IsOptional()
  physiotherapistId?: string
}

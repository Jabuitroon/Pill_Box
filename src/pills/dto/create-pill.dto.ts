import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

export class CreatePillDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string

  @IsString()
  @IsOptional()
  description!: string
}

import { IsString, IsNotEmpty } from 'class-validator'
import { CreateUserDto } from '../../users/dto/create-user.dto'

export class RegisterAdminDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  adminKey!: string
}

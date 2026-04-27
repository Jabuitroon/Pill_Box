import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'
import { HashingService } from '../providers/hashing/hashing.service'
import { responseAuth } from './interfaces'
import { LoginDto } from './dto/login.dto'
import { RegisterAdminDto } from './dto/register-admin.dto'
import { UserRole } from '@app/generated/prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService
  ) {}
  // Lógica para registrar un usuario
  async register(newUser: RegisterDto): Promise<responseAuth> {
    try {
      const user = await this.usersService.create(newUser)
      const payload = { sub: user.user_id, email: user.email, role: user.role }
      return {
        accessToken: this.jwtService.sign(payload)
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al registrar el usuario: ${error}`
      )
    }
  }

  async registerAdmin(payload: RegisterAdminDto) {
    const { adminKey, ...userData } = payload

    // Verificar la llave maestra
    const masterKey = this.configService.get<string>('ADMIN_REGISTRATION_KEY')
    if (adminKey !== masterKey) {
      throw new UnauthorizedException(
        'Llave de registro administrativo inválida'
      )
    }

    // Forzamos el rol a ADMIN
    return await this.usersService.create({
      ...userData,
      role: UserRole.ADMIN
    })
  }

  // Lógica para validar usuario en el Login
  async login({
    email,
    password
  }: LoginDto): Promise<{ access_token: string }> {
    console.log('correo que sale', email)

    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    }

    const isPasswordValid = await this.hashingService.compare(
      password.trim(),
      user.passwordHash
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta')
    }

    // Definir el Payload (lo que viajará dentro del token)
    // Solo info no sensible.
    const payload = { sub: user.user_id, email: user.email, role: user.role }
    const token = await this.jwtService.signAsync(payload)

    return {
      access_token: token
    }
  }

  async getProfile({ sub }: { sub: string }) {
    const user = await this.usersService.findById(sub)
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    }
    return {
      id: user.user_id,
      email: user.email,

      role: user.role
    }
  }
}

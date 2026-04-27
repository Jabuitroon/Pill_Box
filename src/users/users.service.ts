import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { HashingService } from '../providers/hashing/hashing.service'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '../generated/prisma/client'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService
  ) {}

  // Selector común para reutilizar y no repetir código, select de prisma recibe un obj
  private userSelector = {
    user_id: true,
    name: true,
    lastName: true,
    email: true,
    physiotherapistId: true,
    role: true,
    createdAt: true
  }

  async findById(id: string, select?: Prisma.UserSelect) {
    return await this.prisma.user.findUnique({
      where: {
        user_id: id
      },
      select // Si no se pasa, trae todo el objeto
    })
  }

  async findByEmail(email: string, select?: Prisma.UserSelect) {
    console.log('Se va aregistrar', email)
    return await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim()
      },
      select
    })
  }

  async create(payload: CreateUserDto) {
    const { password, physiotherapistId, ...userData } = payload
    // Buscar si el email ya existe de forma proactiva
    const existingUser = await this.findByEmail(payload.email)

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya existe')
    }

    if (physiotherapistId) {
      const physio = await this.prisma.user.findUnique({
        where: { user_id: physiotherapistId }
      })
      if (!physio || physio.role !== 'PHYSIOTHERAPIST') {
        throw new BadRequestException('El fisioterapeuta asignado no es válido')
      }
    }
    try {
      // Hashear la contraseña
      const hashedPassword = await this.hashingService.hash(password.trim())
      // Guardar en PostgreSQL usando Prisma
      return await this.prisma.user.create({
        data: {
          ...userData,
          passwordHash: hashedPassword,
          // Relación con el fisioterapeuta si existe el ID
          physiotherapist: physiotherapistId
            ? { connect: { user_id: physiotherapistId } }
            : undefined
        },
        // Restringir lo que devuelvo mediante el userSelector
        select: this.userSelector
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido'
      throw new InternalServerErrorException(
        `Error al crear el usuario: ${message}`
      )
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        // Solo lo que quiero mostrar
        select: this.userSelector
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException('Error al Buscar Usuarios: ' + errorMessage)
    }
  }

  async findOne(id: string) {
    const userById = await this.prisma.user.findUnique({
      where: { user_id: id },
      select: this.userSelector
    })
    if (!userById) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }
    return userById
  }

  async update(id: string, payload: UpdateUserDto) {
    const { password, ...userData } = payload
    const dataToUpdate: Prisma.UserUpdateInput = { ...userData }

    if (password) {
      dataToUpdate.passwordHash = await this.hashingService.hash(
        password.trim()
      )
    }

    try {
      return await this.prisma.user.update({
        where: { user_id: id },
        data: dataToUpdate,
        select: this.userSelector
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Usuario con id ${id} no existe`)
      }
      throw new InternalServerErrorException('Error al actualizar')
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { user_id: id }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Usuario con id ${id} no existe para eliminar`
        )
      }
      throw new InternalServerErrorException()
    }
  }
}

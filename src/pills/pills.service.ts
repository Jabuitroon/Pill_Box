import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePillDto } from './dto/create-pill.dto'
import { UpdatePillDto } from './dto/update-pill.dto'
import { Prisma } from '../generated/prisma/client'

@Injectable()
export class PillsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPillDto: CreatePillDto) {
    try {
      return await this.prisma.pill.create({
        data: createPillDto
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `La pastilla "${createPillDto.name}" ya existe.`
        )
      }
      throw new InternalServerErrorException('Error al crear la pastilla')
    }
  }

  async findAll() {
    return await this.prisma.pill.findMany({
      orderBy: { name: 'asc' }
    })
  }

  async findOne(id: string) {
    const pill = await this.prisma.pill.findUnique({
      where: { pill_id: id }
    })
    if (!pill)
      throw new NotFoundException(`Pastilla con ID ${id} no encontrada`)
    return pill
  }

  async update(id: string, updatePillDto: UpdatePillDto) {
    await this.findOne(id) // Validar que existe
    try {
      return await this.prisma.pill.update({
        where: { pill_id: id },
        data: updatePillDto
      })
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error al actualizar la pastilla')
    }
  }

  async remove(id: string) {
    await this.findOne(id)
    return await this.prisma.pill.delete({
      where: { pill_id: id }
    })
  }
}

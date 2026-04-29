import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePrescriptionDto } from './dto/create-prescription.dto'
import { UpdatePrescriptionDto } from './dto/update-prescription.dto'
import { Prisma } from '../generated/prisma/client'

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePrescriptionDto) {
    // 1. Validar que el paciente existe
    const patient = await this.prisma.user.findUnique({
      where: { user_id: dto.patientId }
    })
    if (!patient) throw new NotFoundException('Paciente no encontrado')

    // 2. Validar que la pastilla existe
    const pill = await this.prisma.pill.findUnique({
      where: { pill_id: dto.pillId }
    })
    if (!pill) throw new NotFoundException('Pastilla no encontrada')

    // 3. Crear la receta
    return await this.prisma.prescription.create({
      // Fe de erratas: this.prisma.prescription.create
      data: {
        patientId: dto.patientId,
        pillId: dto.pillId,
        schedule: dto.schedule,
        timesPerDay: dto.timesPerDay,
        intakeTime: dto.intakeTime
      },
      include: { pill: true, patient: true }
    })
  }

  async findAllByPatient(patientId: string) {
    return await this.prisma.prescription.findMany({
      where: { patientId, isActive: true },
      include: { pill: true }
    })
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { prescription_id: id },
      include: {
        pill: true,
        patient: {
          select: { name: true, lastName: true, phone: true }
        }
      }
    })

    if (!prescription) {
      throw new NotFoundException(`La receta con ID ${id} no existe`)
    }

    return prescription
  }

  async update(id: string, updateDto: UpdatePrescriptionDto) {
    // 1. Verificamos que la receta exista
    const exists = await this.prisma.prescription.findUnique({
      where: { prescription_id: id }
    })

    if (!exists) throw new NotFoundException('La receta no existe')

    // 2. Actualizamos solo la hora o los campos enviados
    return await this.prisma.prescription.update({
      where: { prescription_id: id },
      data: { ...updateDto }
    })
  }

  async remove(id: string) {
    await this.prisma.prescription.findUnique({
      where: { prescription_id: id }
    })

    try {
      return await this.prisma.prescription.delete({
        where: { prescription_id: id }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`No se encontró el id: ${id} para eliminar`)
      }
      throw new InternalServerErrorException()
    }
  }
}

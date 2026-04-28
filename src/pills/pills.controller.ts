import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe
} from '@nestjs/common'
import { PillsService } from './pills.service'
import { CreatePillDto } from './dto/create-pill.dto'
import { UpdatePillDto } from './dto/update-pill.dto'
import { AuthGuard } from '../auth/guards/auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@app/auth/enums'
import { Public } from '@app/common/decorators/public.decorator'

@UseGuards(AuthGuard, RolesGuard)
// se puede listar los roles
@Roles(Role.PHYSIOTHERAPIST)
@Controller('pills')
export class PillsController {
  constructor(private readonly pillsService: PillsService) {}

  @Post()
  create(@Body() createPillDto: CreatePillDto) {
    return this.pillsService.create(createPillDto)
  }

  @Get()
  findAll() {
    return this.pillsService.findAll()
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pillsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePillDto: UpdatePillDto
  ) {
    return this.pillsService.update(id, updatePillDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pillsService.remove(id)
  }
}

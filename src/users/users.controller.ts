// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from '../auth/guards/auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Role } from '../auth/enums'
import { Roles } from '../auth/decorators/roles.decorator'

// ─────────────────────────────────────────────────────────────
// Esquemas de respuesta reutilizables para Swagger
// ─────────────────────────────────────────────────────────────
const UserResponseSchema = {
  schema: {
    example: {
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Carlos',
      lastName: 'Rodríguez',
      phone: '+573001234567',
      email: 'carlos.rodriguez@email.com',
      physiotherapistId: null,
      role: 'PATIENT',
      createdAt: '2024-01-15T10:30:00.000Z'
    }
  }
}

const ErrorSchemas = {
  unauthorized: {
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  },
  forbidden: {
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
  },
  notFound: (id = ':id') => ({
    schema: {
      example: {
        statusCode: 404,
        message: `Usuario con id ${id} no encontrado`,
        error: 'Not Found'
      }
    }
  }),
  badRequest: (msg = 'El correo electrónico ya existe') => ({
    schema: {
      example: {
        statusCode: 400,
        message: msg,
        error: 'Bad Request'
      }
    }
  })
}

// ─────────────────────────────────────────────────────────────

@ApiTags('Users')
@ApiBearerAuth('access-token') // Nombre definido en swagger.config.ts
@ApiUnauthorizedResponse({
  description: 'Token JWT ausente, inválido o expirado.',
  ...ErrorSchemas.unauthorized
})
@ApiForbiddenResponse({
  description: 'El usuario autenticado no tiene el rol ADMIN.',
  ...ErrorSchemas.forbidden
})
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ──────────────────────────────────────────────────────────
  // POST /users
  // ──────────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description: `
Crea un nuevo usuario en el sistema.

**Reglas de negocio:**
- El email debe ser único en el sistema.
- Si se proporciona \`physiotherapistId\`, el usuario referenciado debe existir y tener el rol \`PHYSIOTHERAPIST\`.
- La contraseña se almacena hasheada (bcrypt). **Nunca se retorna en la respuesta.**
- Si no se especifica \`role\`, Prisma asigna \`PATIENT\` por defecto.
    `
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Usuario creado exitosamente.',
    ...UserResponseSchema
  })
  @ApiBadRequestResponse({
    description: 'Email duplicado o fisioterapeuta inválido.',
    ...ErrorSchemas.badRequest()
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno al crear el usuario.'
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  // ──────────────────────────────────────────────────────────
  // GET /users
  // ──────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description: 'Retorna el listado completo de usuarios. Requiere rol ADMIN.'
  })
  @ApiOkResponse({
    description: 'Listado de usuarios obtenido correctamente.',
    schema: {
      type: 'array',
      items: UserResponseSchema.schema,
      example: [UserResponseSchema.schema.example]
    }
  })
  findAll() {
    return this.usersService.findAll()
  }

  // ──────────────────────────────────────────────────────────
  // GET /users/:id
  // ──────────────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description: 'Busca y retorna un usuario específico por su UUID.'
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  @ApiOkResponse({
    description: 'Usuario encontrado.',
    ...UserResponseSchema
  })
  @ApiNotFoundResponse({
    description: 'No existe ningún usuario con ese ID.',
    ...ErrorSchemas.notFound()
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  // ──────────────────────────────────────────────────────────
  // PATCH /users/:id
  // ──────────────────────────────────────────────────────────
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario parcialmente',
    description: `
Actualiza uno o más campos de un usuario existente. Todos los campos son opcionales.

**Notas:**
- Si se envía \`password\`, se vuelve a hashear automáticamente.
- El \`email\` debe seguir siendo único si se actualiza.
    `
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del usuario a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'Usuario actualizado correctamente.',
    ...UserResponseSchema
  })
  @ApiNotFoundResponse({
    description: 'El usuario con ese ID no existe.',
    ...ErrorSchemas.notFound()
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno al actualizar.'
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  // ──────────────────────────────────────────────────────────
  // DELETE /users/:id
  // ──────────────────────────────────────────────────────────
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un usuario',
    description:
      'Elimina permanentemente un usuario del sistema. Esta acción **no se puede deshacer**.'
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del usuario a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  @ApiOkResponse({
    description: 'Usuario eliminado correctamente.',
    schema: {
      example: {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Carlos',
        email: 'carlos.rodriguez@email.com'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'El usuario con ese ID no existe para eliminar.',
    ...ErrorSchemas.notFound()
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}

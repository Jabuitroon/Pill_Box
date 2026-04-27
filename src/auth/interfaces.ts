import { Request } from 'express'
import { Role } from './enums'

export interface responseAuth {
  accessToken: string
}

// Forma del Payload que se guardó desde el JWT
export interface JwtPayload {
  sub: string
  email: string
  role: Role
  iat: number
  exp: number
}

// Por seguridad, no se debería exponer toda la información del usuario, solo lo necesario para identificarlo y autorizarlo
// Estoy usando el ID para las consultas sql??
export interface UserActiveInterface {
  sub: string
  role: Role
}

// Extendemos la Request de Express para incluir al usuario
export interface RequestWithUser extends Request {
  user: JwtPayload
}

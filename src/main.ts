import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())

  // Permite utilizar class transformer a nivel global para los dto
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // Elimina campos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían campos de más
      transform: true // Convierte tipos automáticamente
    })
  )

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true, // Permite cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Es mejor dejarlo claro
    allowedHeaders: 'Content-Type, Accept, Authorization'
  })

  // 1. Configurar los detalles de la documentación
  const config = new DocumentBuilder()
    .setTitle('API de Pillbox')
    .setDescription(
      `
      ## Documentación de la API REST
 
### Autenticación
Todos los endpoints de \`/users\` requieren un **JWT Bearer Token** con rol **ADMIN**.
 
Para obtener un token, usa el endpoint \`POST /auth/login\` y copia el valor en el botón **Authorize 🔒**.
 
### Roles disponibles
| Rol | Descripción |
|-----|-------------|
| \`ADMIN\` | Acceso total a la gestión de usuarios |
| \`PHYSIOTHERAPIST\` | Fisioterapeuta, puede ser asignado a pacientes |
| \`PATIENT\` | Paciente del sistema |
 
### Códigos de error comunes
| Código | Significado |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | Token ausente o expirado |
| 403 | Sin permisos suficientes |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |
`
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingresa el JWT token obtenido en /auth/login',
        in: 'header'
      },
      'access-token' // Nombre de la seguridad, referenciado en los controladores
    )
    .addTag('vulnerabilidades')
    .build()

  // 2. Crear el documento
  const documentFactory = () => SwaggerModule.createDocument(app, config)

  // 3. Configurar la ruta donde se expondrá la UI de Swagger
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token al recargar
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'list',
      filter: true
    },
    customSiteTitle: 'API Fisioterapia - Docs'
  })
  await app.listen(process.env.PORT ?? 3000)

  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 3000}`
  )
}
bootstrap()

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/env.validation'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate, // Attaches the Zod validation logic
      isGlobal: true, // Makes ConfigService available everywhere
      cache: true
    }),
    PrismaModule
  ]
})
export class AppModule {}

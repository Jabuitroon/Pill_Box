import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/env.validation'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PillsModule } from './pills/pills.module'
import { PrescriptionsModule } from './prescriptions/prescriptions.module'
import { WhatsappModule } from './whatsapp/whatsapp.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate, // Attaches the Zod validation logic
      isGlobal: true, // Makes ConfigService available everywhere
      cache: true
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PillsModule,
    PrescriptionsModule,
    WhatsappModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

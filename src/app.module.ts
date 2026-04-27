import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/env.validation'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate, // Attaches the Zod validation logic
      isGlobal: true, // Makes ConfigService available everywhere
      cache: true
    }),
    PrismaModule,
    UsersModule,
    AuthModule
  ]
})
export class AppModule {}

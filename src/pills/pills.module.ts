import { Module } from '@nestjs/common';
import { PillsService } from './pills.service';
import { PillsController } from './pills.controller';

@Module({
  controllers: [PillsController],
  providers: [PillsService],
})
export class PillsModule {}

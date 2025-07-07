import { Module } from '@nestjs/common';
import { SeriesController } from '../controllers/series.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SeriesController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SeriesModule {}
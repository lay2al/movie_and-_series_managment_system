import { Module } from '@nestjs/common';
import { MovieController } from '../controllers/movie.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MovieController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class MovieModule {}
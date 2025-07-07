import { Module } from '@nestjs/common';
import { WatchlistController } from '../controllers/watchlist.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WatchlistController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class WatchlistModule {}
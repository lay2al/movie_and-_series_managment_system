import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service'; 

import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { SeriesModule } from './series/series.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    UserModule,
    MovieModule,
    SeriesModule,
    WatchlistModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
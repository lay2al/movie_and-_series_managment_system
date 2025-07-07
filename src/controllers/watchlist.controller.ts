import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('watchlists')
export class WatchlistController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWatchlistItem(@Body() watchlistItemData: { userId: number; movieId?: number; seriesId?: string; mediaType?: string; watchStatus?: string; note?: string }) {
    if (!watchlistItemData.userId || (!watchlistItemData.movieId && !watchlistItemData.seriesId)) {
      throw new HttpCode(HttpStatus.BAD_REQUEST);
    }

    return this.prisma.watchlist.create({
      data: {
        userId: watchlistItemData.userId,
        movieId: watchlistItemData.movieId,
        seriesId: watchlistItemData.seriesId ? BigInt(watchlistItemData.seriesId) : undefined,
        mediaType: watchlistItemData.mediaType,
        watchStatus: watchlistItemData.watchStatus,
        note: watchlistItemData.note,
      },
    });
  }

  @Get('user/:userId')
  async getWatchlistsByUserId(@Param('userId') userId: string) {
    return this.prisma.watchlist.findMany({
      where: { userId: parseInt(userId) },
      include: {
        movie: true,
        series: true,
      },
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWatchlistItem(@Param('id') id: string) {
    await this.prisma.watchlist.delete({
      where: { id: parseInt(id) },
    });
  }

  @Put(':id')
  async updateWatchlistItem(@Param('id') id: string, @Body() updateData: { watchStatus?: string; note?: string }) {
    return this.prisma.watchlist.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }
}
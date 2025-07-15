import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { WatchStatus } from '@prisma/client';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async create(createWatchlistDto: CreateWatchlistDto, userId: number) {
    const { movieId, seriesId, status } = createWatchlistDto;

    if (!movieId && !seriesId) {
      throw new BadRequestException('Either movieId or seriesId must be provided');
    }

    if (movieId && seriesId) {
      throw new BadRequestException('Only one of movieId or seriesId can be provided');
    }

    // Check if movie/series exists
    if (movieId) {
      const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movieId} not found`);
      }
    }

    if (seriesId) {
      const series = await this.prisma.series.findUnique({ where: { id: seriesId } });
      if (!series) {
        throw new NotFoundException(`Series with ID ${seriesId} not found`);
      }
    }

    // Check if already in watchlist
    const existing = await this.prisma.watchlist.findFirst({
      where: {
        userId,
        movieId: movieId || undefined,
        seriesId: seriesId || undefined,
      },
    });

    if (existing) {
      throw new BadRequestException('Item already in watchlist');
    }

    return this.prisma.watchlist.create({
      data: {
        userId,
        movieId,
        seriesId,
        status: status || WatchStatus.NOT_WATCHED,
      },
      include: {
        movie: true,
        series: true,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.watchlist.findMany({
      where: { userId },
      include: {
        movie: true,
        series: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMovies(userId: number) {
    return this.prisma.watchlist.findMany({
      where: {
        userId,
        movieId: { not: null },
      },
      include: {
        movie: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSeries(userId: number) {
    return this.prisma.watchlist.findMany({
      where: {
        userId,
        seriesId: { not: null },
      },
      include: {
        series: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(userId: number, status: WatchStatus) {
    return this.prisma.watchlist.findMany({
      where: {
        userId,
        status,
      },
      include: {
        movie: true,
        series: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const watchlistItem = await this.prisma.watchlist.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        movie: true,
        series: true,
      },
    });

    if (!watchlistItem) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    return watchlistItem;
  }

  async update(id: number, updateWatchlistDto: UpdateWatchlistDto, userId: number) {
    const watchlistItem = await this.prisma.watchlist.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!watchlistItem) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    return this.prisma.watchlist.update({
      where: { id },
      data: updateWatchlistDto,
      include: {
        movie: true,
        series: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const watchlistItem = await this.prisma.watchlist.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!watchlistItem) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    await this.prisma.watchlist.delete({
      where: { id },
    });

    return { message: 'Item removed from watchlist successfully' };
  }
}
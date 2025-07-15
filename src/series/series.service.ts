import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) {}

  async create(createSeriesDto: CreateSeriesDto) {
    return this.prisma.series.create({
      data: createSeriesDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as any } },
            { genre: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [series, total] = await Promise.all([
      this.prisma.series.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.series.count({ where }),
    ]);

    return {
      data: series,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const series = await this.prisma.series.findUnique({
      where: { id },
    });

    if (!series) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }

    return series;
  }

  async update(id: number, updateSeriesDto: UpdateSeriesDto) {
    const series = await this.prisma.series.findUnique({
      where: { id },
    });

    if (!series) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }

    return this.prisma.series.update({
      where: { id },
      data: updateSeriesDto,
    });
  }

  async remove(id: number) {
    const series = await this.prisma.series.findUnique({
      where: { id },
    });

    if (!series) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }

    await this.prisma.series.delete({
      where: { id },
    });

    return { message: 'Series deleted successfully' };
  }

  async search(query: string) {
    return this.prisma.series.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' as any } },
          { genre: { contains: query, mode: 'insensitive' as any } },
          { synopsis: { contains: query, mode: 'insensitive' as any } },
        ],
      },
      orderBy: { rating: 'desc' },
    });
  }

  async updatePoster(id: number, posterPath: string) {
    const series = await this.prisma.series.findUnique({
      where: { id },
    });

    if (!series) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }

    return this.prisma.series.update({
      where: { id },
      data: { poster: posterPath },
    });
  }
}
import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSeries(@Body() seriesData: { title: string; startYear: number; endYear?: number; genre?: string; plot?: string; rating?: number; numberOfSeasons?: number }) {
    return this.prisma.series.create({
      data: {
        title: seriesData.title,
        startYear: seriesData.startYear,
        endYear: seriesData.endYear,
        genre: seriesData.genre,
        plot: seriesData.plot,
        rating: seriesData.rating !== undefined ? parseFloat(seriesData.rating.toString()) : undefined,
        numberOfSeasons: seriesData.numberOfSeasons,
      },
    });
  }

  @Get()
  async getAllSeries() {
    return this.prisma.series.findMany();
  }

  @Get(':id')
  async getSeriesById(@Param('id') id: string) {
    const seriesItem = await this.prisma.series.findUnique({
      where: { id: BigInt(id) },
    });
    if (!seriesItem) {
      throw new HttpCode(HttpStatus.NOT_FOUND);
    }
    return seriesItem;
  }

  @Put(':id')
  async updateSeries(@Param('id') id: string, @Body() seriesData: { title?: string; startYear?: number; endYear?: number; genre?: string; plot?: string; rating?: number; numberOfSeasons?: number }) {
    return this.prisma.series.update({
      where: { id: BigInt(id) },
      data: {
        title: seriesData.title,
        startYear: seriesData.startYear,
        endYear: seriesData.endYear,
        genre: seriesData.genre,
        plot: seriesData.plot,
        rating: seriesData.rating !== undefined ? parseFloat(seriesData.rating.toString()) : undefined,
        numberOfSeasons: seriesData.numberOfSeasons,
      },
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeries(@Param('id') id: string) {
    await this.prisma.series.delete({
      where: { id: BigInt(id) },
    });
  }
}
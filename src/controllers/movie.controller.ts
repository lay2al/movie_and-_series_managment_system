import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMovie(@Body() movieData: { title: string; releaseDate: string; genre?: string; plot?: string; rating?: number }) {
    return this.prisma.movie.create({
      data: {
        title: movieData.title,
        releaseDate: new Date(movieData.releaseDate),
        genre: movieData.genre,
        plot: movieData.plot,
        rating: movieData.rating !== undefined ? parseFloat(movieData.rating.toString()) : undefined,
      },
    });
  }

  @Get()
  async getAllMovies() {
    return this.prisma.movie.findMany();
  }

  @Get(':id')
  async getMovieById(@Param('id') id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: parseInt(id) },
      include: { watchlists: true },
    });
    if (!movie) {
      throw new HttpCode(HttpStatus.NOT_FOUND);
    }
    return movie;
  }

  @Put(':id')
  async updateMovie(@Param('id') id: string, @Body() movieData: { title?: string; releaseDate?: string; genre?: string; plot?: string; rating?: number }) {
    return this.prisma.movie.update({
      where: { id: parseInt(id) },
      data: {
        title: movieData.title,
        releaseDate: movieData.releaseDate ? new Date(movieData.releaseDate) : undefined,
        genre: movieData.genre,
        plot: movieData.plot,
        rating: movieData.rating !== undefined ? parseFloat(movieData.rating.toString()) : undefined,
      },
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMovie(@Param('id') id: string) {
    await this.prisma.movie.delete({
      where: { id: parseInt(id) },
    });
  }
}
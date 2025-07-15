import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: {
        ...createMovieDto,
        releaseDate: new Date(createMovieDto.releaseDate),
      },
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

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data: movies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    const updateData: any = { ...updateMovieDto };
    if (updateMovieDto.releaseDate) {
      updateData.releaseDate = new Date(updateMovieDto.releaseDate);
    }

    return this.prisma.movie.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    await this.prisma.movie.delete({
      where: { id },
    });

    return { message: 'Movie deleted successfully' };
  }

  async search(query: string) {
    return this.prisma.movie.findMany({
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
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return this.prisma.movie.update({
      where: { id },
      data: { poster: posterPath },
    });
  }
}
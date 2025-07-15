import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all series' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns paginated list of series' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.seriesService.findAll(page, limit, search);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search series by title, genre, or synopsis' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Returns matching series' })
  async search(@Query('q') query: string) {
    return this.seriesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single series details' })
  @ApiResponse({ status: 200, description: 'Returns series details' })
  @ApiResponse({ status: 404, description: 'Series not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.seriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new series (Admin only)' })
  @ApiBody({
    type: CreateSeriesDto,
    examples: {
      completeSeries: {
        value: {
          title: 'Game of Thrones',
          startYear: 2011,
          endYear: 2019,
          genre: 'Fantasy',
          synopsis: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
          creator: 'David Benioff & D.B. Weiss',
          cast: ['Emilia Clarke', 'Kit Harington', 'Peter Dinklage', 'Lena Headey'],
          numberOfSeasons: 8,
          numberOfEpisodes: 73,
          rating: 9.3,
          poster: 'https://image.tmdb.org/t/p/w500/game-of-thrones.jpg'
        },
        summary: 'Complete series with all fields'
      },
      ongoingSeries: {
        value: {
          title: 'The Last of Us',
          startYear: 2023,
          genre: 'Drama',
          synopsis: 'Joel and Ellie, a pair connected through the harshness of the world they live in, are forced to endure brutal circumstances and ruthless killers on a trek across post-pandemic America.',
          creator: 'Craig Mazin & Neil Druckmann',
          cast: ['Pedro Pascal', 'Bella Ramsey'],
          numberOfSeasons: 1
        },
        summary: 'Ongoing series without end year'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Series created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update series (Admin only)' })
  @ApiBody({
    type: UpdateSeriesDto,
    examples: {
      addEndYear: {
        value: {
          endYear: 2024,
          numberOfEpisodes: 18
        },
        summary: 'Mark series as ended'
      },
      updateSeasons: {
        value: {
          numberOfSeasons: 2,
          numberOfEpisodes: 20,
          cast: ['Pedro Pascal', 'Bella Ramsey', 'Gabriel Luna']
        },
        summary: 'Update seasons and cast'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Series updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Series not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    return this.seriesService.update(id, updateSeriesDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete series (Admin only)' })
  @ApiResponse({ status: 200, description: 'Series deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Series not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.seriesService.remove(id);
  }

  @Post(':id/poster')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `series-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({ summary: 'Upload poster for a series (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        poster: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Poster uploaded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Series not found' })
  async uploadPoster(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const posterPath = `/uploads/posters/${file.filename}`;
    return this.seriesService.updatePoster(id, posterPath);
  }
}
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { WatchStatus } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('watchlist')
@Controller('watchlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  @ApiOperation({ summary: "Get user's complete watchlist" })
  @ApiResponse({ status: 200, description: 'Returns complete watchlist' })
  async findAll(@GetUser() user: any) {
    return this.watchlistService.findAll(user.id);
  }

  @Get('movies')
  @ApiOperation({ summary: 'Get only movies from watchlist' })
  @ApiResponse({ status: 200, description: 'Returns movies in watchlist' })
  async findMovies(@GetUser() user: any) {
    return this.watchlistService.findMovies(user.id);
  }

  @Get('series')
  @ApiOperation({ summary: 'Get only series from watchlist' })
  @ApiResponse({ status: 200, description: 'Returns series in watchlist' })
  async findSeries(@GetUser() user: any) {
    return this.watchlistService.findSeries(user.id);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Filter watchlist by watch status' })
  @ApiParam({ 
    name: 'status',
    enum: WatchStatus,
    examples: {
      watching: { value: 'WATCHING', summary: 'Currently watching' },
      completed: { value: 'COMPLETED', summary: 'Finished watching' },
      notWatched: { value: 'NOT_WATCHED', summary: 'Not started yet' }
    }
  })
  @ApiResponse({ status: 200, description: 'Returns filtered watchlist' })
  async findByStatus(
    @Param('status') status: WatchStatus,
    @GetUser() user: any,
  ) {
    return this.watchlistService.findByStatus(user.id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single watchlist item' })
  @ApiResponse({ status: 200, description: 'Returns watchlist item' })
  @ApiResponse({ status: 404, description: 'Watchlist item not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: any,
  ) {
    return this.watchlistService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add movie/series to watchlist' })
  @ApiBody({
    type: CreateWatchlistDto,
    examples: {
      addMovie: {
        value: {
          movieId: 1,
          status: 'WANT_TO_WATCH'
        },
        summary: 'Add movie to watchlist'
      },
      addSeries: {
        value: {
          seriesId: 1,
          status: 'WATCHING'
        },
        summary: 'Add series to watchlist'
      },
      addCompleted: {
        value: {
          movieId: 2,
          status: 'COMPLETED'
        },
        summary: 'Add already watched movie'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Item added to watchlist' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Movie/Series not found' })
  async create(
    @Body() createWatchlistDto: CreateWatchlistDto,
    @GetUser() user: any,
  ) {
    return this.watchlistService.create(createWatchlistDto, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update watchlist item' })
  @ApiBody({
    type: UpdateWatchlistDto,
    examples: {
      markWatching: {
        value: {
          status: 'WATCHING'
        },
        summary: 'Start watching'
      },
      markCompleted: {
        value: {
          status: 'COMPLETED',
          personalRating: 9.0,
          notes: 'Amazing movie! The cinematography was breathtaking.'
        },
        summary: 'Mark as completed with review'
      },
      updateRating: {
        value: {
          personalRating: 7.5
        },
        summary: 'Update rating only'
      },
      addNotes: {
        value: {
          notes: 'Need to rewatch this with friends. They would love the action scenes!'
        },
        summary: 'Add personal notes'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Watchlist item updated' })
  @ApiResponse({ status: 404, description: 'Watchlist item not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWatchlistDto: UpdateWatchlistDto,
    @GetUser() user: any,
  ) {
    return this.watchlistService.update(id, updateWatchlistDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove from watchlist' })
  @ApiResponse({ status: 200, description: 'Item removed from watchlist' })
  @ApiResponse({ status: 404, description: 'Watchlist item not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: any,
  ) {
    return this.watchlistService.remove(id, user.id);
  }
}
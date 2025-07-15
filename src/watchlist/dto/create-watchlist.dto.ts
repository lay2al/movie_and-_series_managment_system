import { IsNumber, IsOptional, IsEnum, ValidateIf } from 'class-validator';
import { WatchStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWatchlistDto {
  @ApiPropertyOptional({ 
    example: 1,
    description: 'ID of the movie to add to watchlist (provide either movieId or seriesId)'
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => !o.seriesId)
  movieId?: number;

  @ApiPropertyOptional({ 
    example: 1,
    description: 'ID of the series to add to watchlist (provide either movieId or seriesId)'
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => !o.movieId)
  seriesId?: number;

  @ApiPropertyOptional({ 
    enum: WatchStatus,
    default: WatchStatus.NOT_WATCHED,
    example: 'WANT_TO_WATCH',
    description: 'Initial watch status'
  })
  @IsEnum(WatchStatus)
  @IsOptional()
  status?: WatchStatus;
}
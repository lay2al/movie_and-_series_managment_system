import { IsEnum, IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { WatchStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWatchlistDto {
  @ApiPropertyOptional({ 
    enum: WatchStatus,
    example: 'WATCHING',
    description: 'Current watch status'
  })
  @IsEnum(WatchStatus)
  @IsOptional()
  status?: WatchStatus;

  @ApiPropertyOptional({ 
    example: 8.5,
    minimum: 0,
    maximum: 10,
    description: 'Your personal rating (0-10)'
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  personalRating?: number;

  @ApiPropertyOptional({ 
    example: 'Great movie! Really enjoyed the plot twist.',
    description: 'Personal notes or review'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
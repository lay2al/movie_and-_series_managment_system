import { IsString, IsNumber, IsOptional, Min, Max, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeriesDto {
  @ApiProperty({ example: 'Breaking Bad' })
  @IsString()
  title: string;

  @ApiProperty({ example: 2008 })
  @IsNumber()
  startYear: number;

  @ApiPropertyOptional({ example: 2013 })
  @IsNumber()
  @IsOptional()
  endYear?: number;

  @ApiProperty({ example: 'Drama' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 'A high school chemistry teacher turned methamphetamine producer...' })
  @IsString()
  synopsis: string;

  @ApiPropertyOptional({ example: 'Vince Gilligan' })
  @IsString()
  @IsOptional()
  creator?: string;

  @ApiPropertyOptional({ example: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];

  @ApiProperty({ example: 5 })
  @IsNumber()
  numberOfSeasons: number;

  @ApiPropertyOptional({ example: 62, description: 'Total number of episodes' })
  @IsInt()
  @Min(1)
  @IsOptional()
  numberOfEpisodes?: number;

  @ApiPropertyOptional({ example: 9.5, minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 'https://image.tmdb.org/t/p/w500/breaking-bad.jpg' })
  @IsString()
  @IsOptional()
  poster?: string;
}
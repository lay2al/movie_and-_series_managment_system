import { IsString, IsDateString, IsNumber, IsOptional, Min, Max, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Matrix' })
  @IsString()
  title: string;

  @ApiProperty({ example: '1999-03-31' })
  @IsDateString()
  releaseDate: string;

  @ApiProperty({ example: 'Sci-Fi' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 'A computer hacker learns about the true nature of reality...' })
  @IsString()
  synopsis: string;

  @ApiPropertyOptional({ example: 'The Wachowskis' })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiPropertyOptional({ example: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];

  @ApiPropertyOptional({ example: 136, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ example: 8.7, minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 'https://image.tmdb.org/t/p/w500/matrix.jpg' })
  @IsString()
  @IsOptional()
  poster?: string;
}
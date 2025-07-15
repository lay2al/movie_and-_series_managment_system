import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ 
    example: 'john.updated@example.com',
    description: 'Updated email address'
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    example: 'NewSecurePass456!',
    description: 'New password (minimum 6 characters)'
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ 
    example: 'John Smith',
    description: 'Updated full name'
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ 
    enum: UserRole,
    example: UserRole.ADMIN,
    description: 'User role (ADMIN only for role updates)'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
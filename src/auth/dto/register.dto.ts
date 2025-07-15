import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'john.doe@example.com',
    description: 'User email address'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecurePassword123!',
    description: 'User password (minimum 6 characters)'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: 'John Doe',
    description: 'User full name'
  })
  @IsString()
  @MinLength(2)
  name: string;
}
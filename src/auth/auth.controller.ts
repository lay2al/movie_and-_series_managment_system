import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      example1: {
        value: {
          email: 'newuser@example.com',
          password: 'MySecurePass123!',
          name: 'New User'
        },
        summary: 'Basic user registration'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new admin user (Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin user successfully registered' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async registerAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, UserRole.ADMIN);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    type: LoginDto,
    examples: {
      admin: {
        value: {
          email: 'admin@movies.com',
          password: 'admin123'
        },
        summary: 'Admin login'
      },
      user: {
        value: {
          email: 'user@movies.com',
          password: 'user123'
        },
        summary: 'Regular user login'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
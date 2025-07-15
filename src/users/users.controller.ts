import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user profile' })
  async getProfile(@GetUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      updateName: {
        value: {
          name: 'Jane Doe'
        },
        summary: 'Update only name'
      },
      updateEmail: {
        value: {
          email: 'newemail@example.com'
        },
        summary: 'Update email address'
      },
      updatePassword: {
        value: {
          password: 'MyNewSecurePassword123!'
        },
        summary: 'Change password'
      },
      updateMultiple: {
        value: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com'
        },
        summary: 'Update multiple fields'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@GetUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto, user.id, user.role);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns list of all users' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Put(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: ['USER', 'ADMIN'],
          example: 'ADMIN'
        }
      },
      required: ['role']
    },
    examples: {
      promoteToAdmin: {
        value: {
          role: 'ADMIN'
        },
        summary: 'Promote user to admin'
      },
      demoteToUser: {
        value: {
          role: 'USER'
        },
        summary: 'Demote to regular user'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRole(id, role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own account unless admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.usersService.remove(id, user.id, user.role);
  }
}
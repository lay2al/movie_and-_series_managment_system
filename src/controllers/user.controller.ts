import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Controller('users') 
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userData: { username: string; email: string; passwordHash: string }) {
        return this.prisma.user.create({
      data: userData,
    });
  }

  @Get()
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        watchlists: true, 
      },
    });
    if (!user) {
      throw new HttpCode(HttpStatus.NOT_FOUND); 
    }
    return user;
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: { username?: string; email?: string; passwordHash?: string }) {
    return this.prisma.user.update({
      where: { id: parseInt(id) },
      data: userData,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async deleteUser(@Param('id') id: string) {
    await this.prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }
}
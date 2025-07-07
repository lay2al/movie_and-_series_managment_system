import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class UserModule {}
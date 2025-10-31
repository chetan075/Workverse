import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/common/Prisma.service';

@Module({
  providers: [UsersService , PrismaService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

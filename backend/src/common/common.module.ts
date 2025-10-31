import { Module } from '@nestjs/common';
import { PrismaService } from './Prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [],
  exports: [PrismaService],
})
export class CommonModule {}

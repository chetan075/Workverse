import { Module } from '@nestjs/common';
import { ValueLinkService } from './valuelink.service';
import { ValueLinkController } from './valuelink.controller';
import { PrismaService } from 'src/common/Prisma.service';

@Module({
  providers: [ValueLinkService, PrismaService],
  controllers: [ValueLinkController],
  exports: [ValueLinkService],
})
export class ValueLinkModule {}

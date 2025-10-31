import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaService } from 'src/common/Prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [InvoicesService, PrismaService],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}

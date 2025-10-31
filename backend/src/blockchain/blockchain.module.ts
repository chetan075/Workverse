import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { PrismaService } from 'src/common/Prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [BlockchainService, PrismaService],
  controllers: [BlockchainController],
  exports: [BlockchainService],
})
export class BlockchainModule {}

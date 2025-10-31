import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PrismaModule } from './common/Prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ValueLinkModule } from './valuelink/valuelink.module';
import { PaymentsModule } from './payments/payments.module';
import { CommonModule } from './common/common.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // PrismaModule,
    AuthModule,
    UsersModule,
    InvoicesModule,
      ValueLinkModule,
      PaymentsModule,
      BlockchainModule,
      CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

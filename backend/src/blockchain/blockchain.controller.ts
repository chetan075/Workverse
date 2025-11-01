import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

class ChallengeDto {
  address!: string;
}

class VerifyDto {
  address!: string;
  signature!: string;
  // hex-encoded public key (required for cryptographic verification)
  publicKey!: string;
}

@Controller('blockchain')
export class BlockchainController {
  constructor(private service: BlockchainService) {}

  @Post('auth/request-challenge')
  requestChallenge(@Body() dto: ChallengeDto) {
    return this.service.requestChallenge(dto.address);
  }

  @Post('auth/verify')
  verify(@Body() dto: VerifyDto) {
    if (!dto.publicKey)
      throw new BadRequestException('publicKey is required for verification');
    const res = this.service.verifySignature(
      dto.address,
      dto.signature,
      dto.publicKey,
    );
    if (!res) throw new UnauthorizedException('signature verification failed');
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('mint-invoice/:invoiceId')
  async mintInvoice(@Param('invoiceId') invoiceId: string, @Req() req: any) {
    // req.user.sub contains wallet address per verifySignature
    return this.service.mintInvoiceNFT(invoiceId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mint-sbt/:userId')
  async mintSBT(@Param('userId') userId: string) {
    return this.service.mintReputationSBT(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('publish')
  async publishModule() {
    // requires APTOS_PRIVATE_KEY to be set in the environment of the server
    return this.service.publishEscrowModule();
  }
}

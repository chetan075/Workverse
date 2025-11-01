import { Body, Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { v4 as uuidv4 } from 'uuid';

type OpenDto = { invoiceId: string; openerId: string; reason: string };
type VoteDto = { userId: string; vote: 'for' | 'against' };

@Controller('disputes')
export class DisputesController {
  constructor(private svc: DisputesService) {}

  @Post('open')
  open(@Body() body: OpenDto) {
    // Validate required fields
    if (!body.invoiceId || !body.openerId || !body.reason) {
      throw new BadRequestException('Missing required fields: invoiceId, openerId, reason');
    }

    if (typeof body.reason !== 'string' || body.reason.trim().length === 0) {
      throw new BadRequestException('Reason must be a non-empty string');
    }

    const d = {
      id: uuidv4(),
      invoiceId: body.invoiceId.trim(),
      openerId: body.openerId.trim(),
      reason: body.reason.trim(),
    };
    return this.svc.open(d);
  }

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Dispute ID is required');
    }
    return this.svc.find(id.trim());
  }

  @Post(':id/vote')
  vote(@Param('id') id: string, @Body() body: VoteDto) {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Dispute ID is required');
    }

    if (!body.userId || !body.vote) {
      throw new BadRequestException('Missing required fields: userId, vote');
    }

    if (!['for', 'against'].includes(body.vote)) {
      throw new BadRequestException('Vote must be either "for" or "against"');
    }

    return this.svc.vote(id.trim(), body.userId.trim(), body.vote);
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Dispute ID is required');
    }
    return this.svc.resolve(id.trim());
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReputationService } from './reputation.service';

type AdjustDto = { delta: number };

@Controller('reputation')
export class ReputationController {
  constructor(private svc: ReputationService) {}

  @Get(':userId')
  get(@Param('userId') userId: string) {
    return this.svc.get(userId);
  }

  @Post(':userId/adjust')
  adjust(@Param('userId') userId: string, @Body() body: AdjustDto) {
    return this.svc.adjust(userId, body.delta || 0);
  }
}

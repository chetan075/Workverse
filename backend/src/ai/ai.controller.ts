import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private ai: AiService) {}

  @Get('invoices/:id/validate')
  async validate(@Param('id') id: string, @Req() req: any) {
    try {
      const result = await this.ai.validateInvoice(id);
      return result;
    } catch (err) {
      throw new HttpException(
        (err as Error).message || 'AI validation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

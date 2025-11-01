import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt.guard';

class CreateInvoiceDto {
  @IsString()
  title!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amount!: number;

  // IDs are strings (cuid/uuid) in Prisma schema
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  freelancerId?: string;
}

class UpdateInvoiceStatusDto {
  @IsString()
  status!: string;
}

@Controller('invoices')
export class InvoicesController {
  constructor(private invoices: InvoicesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any) {
    // return invoices visible to the user (both client and freelancer roles)
    return this.invoices.findAllForUser(req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateInvoiceDto, @Req() req: any) {
    const data = { ...dto, clientId: dto.clientId ?? req.user?.sub };
    return this.invoices.create(data as any);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.invoices.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateInvoiceStatusDto,
  ) {
    return this.invoices.updateStatus(id, body.status);
  }
}

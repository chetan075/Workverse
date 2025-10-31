import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

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

  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    return this.invoices.create(dto as any);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.invoices.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateInvoiceStatusDto) {
    return this.invoices.updateStatus(id, body.status);
  }
}

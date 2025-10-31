import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ValueLinkService } from './valuelink.service';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt.guard';

class CreateValueLinkDto {
  @IsOptional()
  @IsString()
  fromUserId?: string;

  @IsString()
  toUserId!: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  projectId?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  valueScore?: number;
}

@Controller('valuelink')
export class ValueLinkController {
  constructor(private service: ValueLinkService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateValueLinkDto, @Req() req: any) {
    const data = { ...dto, fromUserId: dto.fromUserId ?? req.user?.sub };
    return this.service.create(data as any);
  }

  @Get(':userId')
  async list(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }
}

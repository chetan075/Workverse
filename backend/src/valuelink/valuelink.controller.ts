import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ValueLinkService } from './valuelink.service';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class CreateValueLinkDto {
  @IsString()
  fromUserId!: string;

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

  @Post()
  async create(@Body() dto: CreateValueLinkDto) {
    return this.service.create(dto);
  }

  @Get(':userId')
  async list(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }
}

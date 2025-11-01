import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt.guard';

class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
}

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  async getUsers(@Query('role') role?: string) {
    return await this.users.findProfiles(role);
  }

  @Get('profiles')
  async getProfiles(@Query('role') role?: string) {
    return await this.users.findProfiles(role);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.users.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Req() req: any,
  ) {
    // simple authorization: only allow users to update their own profile
    if (req.user?.sub !== id) {
      throw new UnauthorizedException('Cannot modify other user');
    }
    return this.users.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return this.users.me(req.user.sub);
  }
}

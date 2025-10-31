import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsOptional, IsString } from 'class-validator';

class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
}

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.users.findById(id);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return (this.users.update(id,body));
  }

  @Get('me')
  async me() {
    // Stub: in real app, use auth guard to get user id from token
    return { message: 'Use JWT protected route to get /users/me' };
  }
}

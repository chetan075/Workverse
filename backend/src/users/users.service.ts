import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: Partial<{ name: string }>) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async me(id: string) {
    return this.findById(id);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';

@Injectable()
export class ValueLinkService {
  constructor(private prisma: PrismaService) {}

  // IDs are strings in Prisma schema
  async create(data: {
    fromUserId: string;
    toUserId: string;
    projectId?: number;
    valueScore?: number;
  }) {
    return this.prisma.valueLink.create({ data });
  }

  async findByUser(userId: string) {
    return this.prisma.valueLink.findMany({
      where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
    });
  }
}

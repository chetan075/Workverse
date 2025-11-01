import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';

@Injectable()
export class ReputationService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string) {
    const r = await this.prisma.reputation.findUnique({ where: { userId } });
    if (!r) {
      return { userId, score: 0, updatedAt: new Date().toISOString() };
    }
    return r;
  }

  async adjust(userId: string, delta: number) {
    const updated = await this.prisma.reputation.upsert({
      where: { userId },
      update: { score: { increment: delta } },
      create: { userId, score: delta },
    });
    return updated;
  }
}

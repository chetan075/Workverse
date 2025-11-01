import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  // Prisma models use string ids (cuid/uuid). Accept string ids for relations.
  async create(data: {
    title: string;
    amount: number;
    clientId?: string;
    freelancerId?: string;
  }) {
    return this.prisma.invoice.create({ data });
  }

  async findOne(id: string) {
    const inv = await this.prisma.invoice.findUnique({ where: { id } });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }

  async findAllForUser(userId?: string) {
    if (!userId) return this.prisma.invoice.findMany();
    // return invoices where user is client or freelancer
    return this.prisma.invoice.findMany({
      where: {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status: status as any },
    });
  }
}

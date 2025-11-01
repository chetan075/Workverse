import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';

@Injectable()
export class DisputesService {
  private logger = new Logger(DisputesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async open(dispute: { id: string; invoiceId: string; openerId: string; reason: string }) {
    // Validate that the invoice exists
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: dispute.invoiceId }
    });

    if (!invoice) {
      this.logger.error(`Invoice with ID ${dispute.invoiceId} not found`);
      throw new NotFoundException(`Invoice with ID ${dispute.invoiceId} not found`);
    }

    // Validate that the opener (user) exists
    const opener = await this.prisma.user.findUnique({
      where: { id: dispute.openerId }
    });

    if (!opener) {
      this.logger.error(`User (opener) with ID ${dispute.openerId} not found`);
      throw new NotFoundException(`User with ID ${dispute.openerId} not found`);
    }

    // Check if there's already an open dispute for this invoice
    const existingDispute = await this.prisma.dispute.findFirst({
      where: {
        invoiceId: dispute.invoiceId,
        resolved: false
      }
    });

    if (existingDispute) {
      this.logger.error(`Active dispute already exists for invoice ${dispute.invoiceId}`);
      throw new BadRequestException(`An active dispute already exists for this invoice`);
    }

    try {
      const created = await this.prisma.dispute.create({
        data: {
          id: dispute.id,
          invoiceId: dispute.invoiceId,
          openerId: dispute.openerId,
          reason: dispute.reason,
        },
      });
      
      this.logger.log(`Opened dispute ${created.id} for invoice ${created.invoiceId}`);
      return created;
    } catch (error) {
      this.logger.error(`Failed to create dispute:`, error);
      throw new BadRequestException(`Failed to create dispute: ${error.message}`);
    }
  }

  async list() {
    return this.prisma.dispute.findMany({ include: { votes: true } });
  }

  async find(id: string) {
    return this.prisma.dispute.findUnique({ where: { id }, include: { votes: true } });
  }

  async vote(disputeId: string, userId: string, vote: 'for' | 'against') {
    // First, validate that the dispute exists
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { votes: true }
    });

    if (!dispute) {
      this.logger.error(`Dispute with ID ${disputeId} not found`);
      throw new NotFoundException(`Dispute with ID ${disputeId} not found`);
    }

    if (dispute.resolved) {
      this.logger.error(`Cannot vote on resolved dispute ${disputeId}`);
      throw new BadRequestException(`Cannot vote on resolved dispute ${disputeId}`);
    }

    // Check if user already voted on this dispute
    const existingVote = await this.prisma.disputeVote.findFirst({
      where: {
        disputeId,
        userId
      }
    });

    if (existingVote) {
      this.logger.error(`User ${userId} has already voted on dispute ${disputeId}`);
      throw new BadRequestException(`User has already voted on this dispute`);
    }

    // Validate that the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    try {
      // Map to VoteChoice enum in Prisma
      const voteChoice = vote === 'for' ? 'FOR' : 'AGAINST';
      
      await this.prisma.disputeVote.create({ 
        data: { 
          disputeId, 
          userId, 
          vote: voteChoice 
        } 
      });

      this.logger.log(`User ${userId} voted ${voteChoice} on dispute ${disputeId}`);
      
      return this.find(disputeId);
    } catch (error) {
      this.logger.error(`Failed to create vote for dispute ${disputeId}:`, error);
      throw new BadRequestException(`Failed to create vote: ${error.message}`);
    }
  }

  async resolve(disputeId: string) {
    // Validate that the dispute exists
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { votes: true }
    });

    if (!dispute) {
      this.logger.error(`Dispute with ID ${disputeId} not found`);
      throw new NotFoundException(`Dispute with ID ${disputeId} not found`);
    }

    if (dispute.resolved) {
      this.logger.error(`Dispute ${disputeId} is already resolved`);
      throw new BadRequestException(`Dispute is already resolved`);
    }

    if (dispute.votes.length === 0) {
      this.logger.error(`Cannot resolve dispute ${disputeId} with no votes`);
      throw new BadRequestException(`Cannot resolve dispute with no votes`);
    }

    try {
      const votes = dispute.votes;
      const tally = votes.reduce(
        (acc, v) => ({ 
          for: acc.for + (v.vote === 'FOR' ? 1 : 0), 
          against: acc.against + (v.vote === 'AGAINST' ? 1 : 0) 
        }),
        { for: 0, against: 0 },
      );
      
      let outcome: 'FOR' | 'AGAINST' | 'TIED' = 'TIED';
      if (tally.for > tally.against) outcome = 'FOR';
      else if (tally.for < tally.against) outcome = 'AGAINST';

      const updated = await this.prisma.dispute.update({
        where: { id: disputeId },
        data: { resolved: true, outcome },
        include: { votes: true },
      });
      
      this.logger.log(`Resolved dispute ${disputeId} with outcome ${outcome} (For: ${tally.for}, Against: ${tally.against})`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to resolve dispute ${disputeId}:`, error);
      throw new BadRequestException(`Failed to resolve dispute: ${error.message}`);
    }
  }
}

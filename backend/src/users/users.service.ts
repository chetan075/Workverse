import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findProfiles(role?: string) {
    const whereClause = role ? { role: role as Role } : {};
    
    return this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        // Enhanced profile fields (will test gradually)
        bio: true,
        title: true,
        location: true,
        hourlyRate: true,
        availability: true,
        reputation: {
          select: {
            score: true,
            completedProjects: true,
            averageRating: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            invoicesAsFreelancer: true,
            invoicesAsClient: true,
            linksFrom: true,
            linksTo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        title: true,
        location: true,
        hourlyRate: true,
        availability: true,
        createdAt: true,
        reputation: {
          select: {
            score: true,
            completedProjects: true,
            averageRating: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            invoicesAsFreelancer: true,
            invoicesAsClient: true,
            linksFrom: true,
            linksTo: true,
          },
        },
      },
    });
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

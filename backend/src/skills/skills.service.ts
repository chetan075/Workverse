import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    const where = category ? { category } : {};
    
    return this.prisma.skill.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
  }

  async getCategories() {
    const skills = await this.prisma.skill.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });
    
    return skills.map(skill => skill.category);
  }
}
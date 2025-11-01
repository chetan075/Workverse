import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';

interface OpportunityFilters {
  category?: string;
  difficulty?: string;
  minBudget?: number;
  maxBudget?: number;
}

@Injectable()
export class WorkOpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async findOpportunities(filters: OpportunityFilters = {}) {
    // Use Project model to find available work opportunities
    const whereClause: any = {
      status: 'PLANNING', // Projects in planning stage are work opportunities
      freelancerId: null, // Not yet assigned to a freelancer
    };

    if (filters.minBudget !== undefined) {
      whereClause.budget = { ...whereClause.budget, gte: filters.minBudget };
    }

    if (filters.maxBudget !== undefined) {
      whereClause.budget = { ...whereClause.budget, lte: filters.maxBudget };
    }

    if (filters.difficulty) {
      whereClause.difficulty = filters.difficulty.toUpperCase();
    }

    const opportunities = await this.prisma.project.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            reputation: {
              select: {
                score: true,
                averageRating: true,
                completedProjects: true,
              },
            },
          },
        },
        skills: {
          include: {
            skill: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    // Transform projects to work opportunities
    return opportunities.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget || 0,
      currency: project.currency || 'USD',
      category: this.categorizeFromSkills(project.skills) || this.categorizeFromTitle(project.title),
      difficulty: project.difficulty || this.getDifficultyFromBudget(project.budget || 0),
      estimatedHours: this.calculateEstimatedHours(project.budget || 0),
      skills: project.skills.map(ps => ps.skill.name),
      client: {
        id: project.client.id,
        name: project.client.name || project.client.email.split('@')[0],
        reputation: project.client.reputation?.score || 0,
        averageRating: project.client.reputation?.averageRating || 0,
        completedProjects: project.client.reputation?.completedProjects || 0,
      },
      postedAt: project.createdAt,
      deadline: project.deadline,
      startDate: project.startDate,
    }));
  }

  private categorizeFromSkills(projectSkills: any[]): string | null {
    if (projectSkills.length === 0) return null;
    
    const skillNames = projectSkills.map(ps => ps.skill.name.toLowerCase());
    
    // Check for frontend/web development skills
    if (skillNames.some(skill => ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'].includes(skill))) {
      return 'Web Development';
    }
    
    // Check for mobile development skills
    if (skillNames.some(skill => ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'].includes(skill))) {
      return 'Mobile Development';
    }
    
    // Check for design skills
    if (skillNames.some(skill => ['ui design', 'ux design', 'figma', 'photoshop', 'design'].includes(skill))) {
      return 'Design';
    }
    
    // Check for data science skills
    if (skillNames.some(skill => ['python', 'r', 'sql', 'data analysis', 'machine learning', 'tableau'].includes(skill))) {
      return 'Data Science';
    }
    
    // Check for backend skills
    if (skillNames.some(skill => ['node.js', 'python', 'java', 'php', 'backend', 'api'].includes(skill))) {
      return 'Backend Development';
    }
    
    return null;
  }

  private calculateEstimatedHours(budget: number): number {
    // Estimate hours based on budget (assuming $50/hour average)
    const estimatedHours = Math.round(budget / 50);
    return Math.max(estimatedHours, 5); // Minimum 5 hours
  }

  private categorizeFromTitle(title: string): string {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('web') || titleLower.includes('website')) return 'Web Development';
    if (titleLower.includes('mobile') || titleLower.includes('app')) return 'Mobile Development';
    if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) return 'Design';
    if (titleLower.includes('data') || titleLower.includes('analysis')) return 'Data Science';
    if (titleLower.includes('write') || titleLower.includes('content')) return 'Writing';
    return 'Other';
  }

  private getDifficultyFromBudget(amount: number): string {
    if (amount < 500) return 'Beginner';
    if (amount < 2000) return 'Intermediate';
    return 'Expert';
  }

  private extractSkillsFromTitle(title: string): string[] {
    const skills: string[] = [];
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('react')) skills.push('React');
    if (titleLower.includes('javascript') || titleLower.includes('js')) skills.push('JavaScript');
    if (titleLower.includes('python')) skills.push('Python');
    if (titleLower.includes('node')) skills.push('Node.js');
    if (titleLower.includes('design')) skills.push('Design');
    if (titleLower.includes('typescript')) skills.push('TypeScript');
    
    return skills.length > 0 ? skills : ['General'];
  }
}
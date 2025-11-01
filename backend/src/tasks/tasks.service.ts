import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/Prisma.service';

interface TaskFilters {
  category?: string;
  priceRange?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedHours: number;
  hourlyRate: number;
  totalPrice: number;
  freelancer: {
    id: string;
    name: string;
    reputation: number;
    completedProjects: number;
  };
  skills: string[];
  availability: string;
  responseTime: string;
}

export interface Service {
  type: string;
  title: string;
  description: string;
  category: string;
  estimatedHours: number;
  skills: string[];
}

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAvailableTasks(filters: TaskFilters = {}) {
    // We'll create tasks from freelancers who have completed work
    // This represents services/tasks they offer
    const freelancers = await this.prisma.user.findMany({
      where: {
        role: 'FREELANCER',
        invoicesAsFreelancer: {
          some: {
            status: 'RELEASED', // Freelancers who have completed work
          },
        },
      },
      include: {
        reputation: true,
        invoicesAsFreelancer: {
          where: { status: 'RELEASED' },
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            invoicesAsFreelancer: true,
          },
        },
      },
      take: 20,
    });

    // Transform freelancers into available tasks/services
    const tasks: Task[] = [];
    
    for (const freelancer of freelancers) {
      const completedProjects = freelancer.invoicesAsFreelancer;
      
      // Create multiple service offerings based on their work history
      const services = this.generateServicesFromHistory(completedProjects);
      
      for (const service of services) {
        tasks.push({
          id: `${freelancer.id}-${service.type}`,
          title: service.title,
          description: service.description,
          category: service.category,
          estimatedHours: service.estimatedHours,
          hourlyRate: this.calculateHourlyRate(completedProjects),
          totalPrice: service.estimatedHours * this.calculateHourlyRate(completedProjects),
          freelancer: {
            id: freelancer.id,
            name: freelancer.name || freelancer.email.split('@')[0],
            reputation: freelancer.reputation?.score || 0,
            completedProjects: freelancer._count.invoicesAsFreelancer,
          },
          skills: service.skills,
          availability: 'Available',
          responseTime: '< 24 hours',
        });
      }
    }

    // Apply filters
    let filteredTasks = tasks;
    
    if (filters.category) {
      filteredTasks = filteredTasks.filter(task => 
        task.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
      filteredTasks = filteredTasks.filter(task => 
        task.totalPrice >= min && task.totalPrice <= max
      );
    }

    return filteredTasks.slice(0, 20); // Limit results
  }

  private generateServicesFromHistory(projects: any[]): Service[] {
    const services: Service[] = [];
    
    // Generate services based on project types
    const categories = ['Web Development', 'Mobile Development', 'Design', 'Data Analysis', 'Writing'];
    
    for (const category of categories) {
      // Check if freelancer has relevant experience
      const relevantProjects = projects.filter(p => 
        this.projectMatchesCategory(p.title, category)
      );
      
      if (relevantProjects.length > 0) {
        services.push(this.createServiceForCategory(category, relevantProjects));
      }
    }
    
    // If no specific category matches, create a general service
    if (services.length === 0) {
      services.push({
        type: 'general',
        title: 'Custom Development Services',
        description: 'Professional development services tailored to your needs',
        category: 'General',
        estimatedHours: 20,
        skills: ['JavaScript', 'Web Development'],
      });
    }
    
    return services;
  }

  private projectMatchesCategory(title: string, category: string): boolean {
    const titleLower = title.toLowerCase();
    const categoryLower = category.toLowerCase();
    
    switch (categoryLower) {
      case 'web development':
        return titleLower.includes('web') || titleLower.includes('website') || titleLower.includes('frontend') || titleLower.includes('backend');
      case 'mobile development':
        return titleLower.includes('mobile') || titleLower.includes('app') || titleLower.includes('ios') || titleLower.includes('android');
      case 'design':
        return titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('logo');
      case 'data analysis':
        return titleLower.includes('data') || titleLower.includes('analysis') || titleLower.includes('analytics') || titleLower.includes('dashboard');
      case 'writing':
        return titleLower.includes('content') || titleLower.includes('writing') || titleLower.includes('blog') || titleLower.includes('copy');
      default:
        return false;
    }
  }

  private createServiceForCategory(category: string, projects: any[]): Service {
    const averageAmount = projects.reduce((sum, p) => sum + p.amount, 0) / projects.length;
    const estimatedHours = Math.max(Math.round(averageAmount / 50), 5); // Minimum 5 hours
    
    const serviceTemplates: Record<string, Omit<Service, 'type' | 'category' | 'estimatedHours'>> = {
      'Web Development': {
        title: 'Custom Web Application Development',
        description: 'Professional web applications built with modern technologies and best practices',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      },
      'Mobile Development': {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications for iOS and Android',
        skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      },
      'Design': {
        title: 'UI/UX Design Services',
        description: 'Modern, user-centered design solutions for web and mobile applications',
        skills: ['UI Design', 'UX Design', 'Figma', 'Photoshop'],
      },
      'Data Analysis': {
        title: 'Data Analysis & Visualization',
        description: 'Transform your data into actionable insights with professional analysis',
        skills: ['Python', 'R', 'SQL', 'Tableau'],
      },
      'Writing': {
        title: 'Technical Writing & Content Creation',
        description: 'High-quality technical documentation and content writing services',
        skills: ['Technical Writing', 'Content Strategy', 'SEO', 'Documentation'],
      },
    };

    const template = serviceTemplates[category] || serviceTemplates['Web Development'];
    
    return {
      type: category.toLowerCase().replace(' ', '-'),
      title: template.title,
      description: template.description,
      category,
      estimatedHours,
      skills: template.skills,
    };
  }

  private calculateHourlyRate(projects: any[]): number {
    if (projects.length === 0) return 50; // Default rate
    
    // Estimate hourly rate based on project amounts
    // This is a rough calculation assuming project complexity
    const totalAmount = projects.reduce((sum, p) => sum + p.amount, 0);
    const estimatedTotalHours = projects.length * 20; // Assume 20 hours per project on average
    
    const rate = Math.round(totalAmount / estimatedTotalHours);
    return Math.max(Math.min(rate, 150), 25); // Clamp between $25-$150
  }
}
import { Controller, Get, Query } from '@nestjs/common';
import { WorkOpportunitiesService } from './work-opportunities.service';

@Controller('work-opportunities')
export class WorkOpportunitiesController {
  constructor(private workOpportunitiesService: WorkOpportunitiesService) {}

  @Get()
  async getWorkOpportunities(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('minBudget') minBudget?: string,
    @Query('maxBudget') maxBudget?: string,
  ) {
    return this.workOpportunitiesService.findOpportunities({
      category,
      difficulty,
      minBudget: minBudget ? parseFloat(minBudget) : undefined,
      maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
    });
  }
}
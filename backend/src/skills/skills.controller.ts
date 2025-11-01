import { Controller, Get, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async getSkills(@Query('category') category?: string) {
    return this.skillsService.findAll(category);
  }

  @Get('categories')
  async getCategories() {
    return this.skillsService.getCategories();
  }
}
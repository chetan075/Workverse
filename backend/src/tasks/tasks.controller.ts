import { Controller, Get, Query } from '@nestjs/common';
import { TasksService, Task } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('available')
  async getAvailableTasks(
    @Query('category') category?: string,
    @Query('priceRange') priceRange?: string,
  ): Promise<Task[]> {
    return this.tasksService.findAvailableTasks({
      category,
      priceRange,
    });
  }
}
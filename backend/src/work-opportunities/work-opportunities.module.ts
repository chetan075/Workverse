import { Module } from '@nestjs/common';
import { WorkOpportunitiesController } from './work-opportunities.controller';
import { WorkOpportunitiesService } from './work-opportunities.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [WorkOpportunitiesController],
  providers: [WorkOpportunitiesService],
  exports: [WorkOpportunitiesService],
})
export class WorkOpportunitiesModule {}
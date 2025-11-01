import { Injectable, Logger } from '@nestjs/common';

type Job = { id: string; name: string; payload: any };

@Injectable()
export class WorkerService {
  private logger = new Logger(WorkerService.name);
  private queue: Job[] = [];

  enqueue(job: Job) {
    this.queue.push(job);
    // process next tick for MVP
    setImmediate(() => this.process(job));
    return job;
  }

  private async process(job: Job) {
    this.logger.log(`Processing job ${job.id} ${job.name}`);
    // simple demos: handle pin-confirmation or reputation recalculation
    if (job.name === 'pin-confirmation') {
      // simulate confirmation
      await new Promise((r) => setTimeout(r, 500));
      this.logger.log(`Pin confirmed for ${JSON.stringify(job.payload)}`);
    }
  }
}

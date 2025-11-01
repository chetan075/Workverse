import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

// Simple Server-Sent Events (SSE) endpoint for MVP
@Controller('realtime')
export class RealtimeController {
  @Get('events')
  events(@Res() res: Response) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.flushHeaders();

    const id = Date.now();
    // send a ping every 15s to keep connection alive
    const interval = setInterval(() => {
      res.write(
        `event: ping\ndata: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`,
      );
    }, 15_000);

    // never-ending connection for demo; close on client disconnect
    reqOnClose(res, () => clearInterval(interval));
  }
}

function reqOnClose(res: Response, cb: () => void) {
  const req = (res as any).req;
  if (!req) return cb();
  req.on('close', cb);
}

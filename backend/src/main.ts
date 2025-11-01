import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Basic production/dev safe defaults
  const front = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, server-to-server)
      if (!origin) return callback(null, true);
      // allow your dev origin, or add other dev origins as needed
      if (origin === front) return callback(null, true);
      // dev fallback: allow any origin (ONLY for dev)
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Capture raw body for Stripe webhook signature verification
  app.use(
    bodyParser.json({
      verify: (req: any, _res, buf) => {
        if (buf && buf.length) req.rawBody = buf.toString();
      },
    }),
  );

  const port = Number(process.env.PORT ?? 5000);
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}/api`);
}

void bootstrap();


import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
  });
  
  // Enhanced CORS configuration for production
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://swap-kohl.vercel.app',
      'https://swap-git-main-younesss-projects-9ada0f82.vercel.app',
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT || 4000;
  await app.listen(port as number, '0.0.0.0');
  console.log(`Swap API (Postgres) listening on http://0.0.0.0:${port}`);
}
bootstrap();

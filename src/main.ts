import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // Strip properties not in DTO
    forbidNonWhitelisted: true,   // Throw error if extra properties sent
    transform: true,              // Auto-transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // Enable CORS
  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NexusTask API running on http://localhost:${port}/api`);
}
bootstrap();
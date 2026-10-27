import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cors from 'cors';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

// Ensure Swagger / esbuild / tsx compatibility for paramtypes metadata
const originalGetMetadata = (Reflect as any).getMetadata;
(Reflect as any).getMetadata = function (metadataKey: any, target: any, propertyKey?: any) {
  const result = originalGetMetadata.apply(this, arguments as any);
  if (result === undefined && metadataKey === 'design:paramtypes') {
    return new Proxy([], {
      get: (arr, prop) => (prop in arr ? (arr as any)[prop] : Object)
    });
  }
  return result;
};

async function bootstrap() {
  const logger = new Logger('PairUpBootstrap');
  const app = await NestFactory.create(AppModule);

  // Security headers & Cross-Origin
  app.use(
    helmet({
      contentSecurityPolicy: false // Allow swagger and development asset loads
    })
  );

  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:8081,http://127.0.0.1:3000')
    .split(',')
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(null, true); // Dev mode permissive
        }
      },
      credentials: true
    })
  );

  // Global API Version Prefix
  app.setGlobalPrefix('api/v1');

  // Global Filters & Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: false
    })
  );

  const port = process.env.PORT || 4000;

  // OpenAPI / Swagger Documentation
  try {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PairUp AI API')
      .setDescription(
        'Enterprise Dating, Friendship & Social Discovery Platform REST & WebSocket API Specification'
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Authentication', 'User signup, login, OTP verification, and session management')
      .addTag('Profiles', 'User profile creation, completeness score, photos, and prompts')
      .addTag('Location & Nearby', 'Geospatial queries, proximity discovery, and coordinate masking')
      .addTag('Discovery & Matching', 'Card deck swiping, mutual match transactions, and rewinds')
      .addTag('Chat & Messaging', 'Real-time WebSocket conversations, voice notes, and reactions')
      .addTag('Voice & Video Calls', 'WebRTC call signaling and SFU room tokens')
      .addTag('Voice Rooms & Audio Communities', 'Live audio rooms, speaker stage, and hand raising')
      .addTag('Social Discovery Events', 'City meetups, RSVP registration, and capacity controls')
      .addTag('Safety & Moderation', 'Report filing, user blocking, and safety guidelines')
      .addTag('Admin & Moderation Platform', 'Privileged RBAC administration and audit logs')
      .addTag('Health & Monitoring', 'Service health check and telemetry')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'PairUp AI API Docs',
      customCss: '.swagger-ui .topbar { display: none }'
    });
    logger.log(`📚 OpenAPI / Swagger documentation at: http://localhost:${port}/api/docs`);
  } catch (err: any) {
    logger.warn(`OpenAPI/Swagger could not be initialized: ${err.message}`);
  }

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 PairUp AI Backend running on: http://localhost:${port}/api/v1`);
  logger.log(`⚡ WebSocket gateway active on port: ${port}`);
}

bootstrap();

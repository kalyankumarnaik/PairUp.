import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);
  const apiPrefix = configService.get<string>('apiPrefix', '/api/v1');
  const corsOrigins = configService.get<string[]>('corsOrigin', ['*']);

  // Set Global Routing Prefix: /api/v1
  app.setGlobalPrefix(apiPrefix.replace(/^\//, ''));

  // Enable CORS
  app.enableCors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Request Validation Pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Handling & Response Wrapping
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // OpenAPI / Swagger Documentation
  if (configService.get<boolean>('swagger.enabled', true)) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PairUp - Core Platform API')
      .setDescription(
        'PairUp full-stack AI-powered dating platform core backend.\n\n' +
          'Owned by Member 1 (Platform Technical Lead & Architect).\n' +
          'Includes Authentication, User Profiles, Discovery Swiping, Mutual Matching, Safety & Inter-Module Contracts.',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token (Bearer token)',
        },
        'JWT-auth',
      )
      .addTag('Authentication & Accounts', 'Registration, login, refresh sessions, email verification, password reset')
      .addTag('Users & Accounts', 'User account settings, password changes, deactivation, and administrative status')
      .addTag('Profiles & Preferences', 'Profile CRUD, photos gallery, prompt answers, interests taxonomy, dating filters, and privacy settings')
      .addTag('Discovery & Matching', 'Algorithmic candidate feed, like/pass swiping actions, mutual matches, unmatching')
      .addTag('Safety, Moderation & Account Controls', 'User blocking, moderation reporting pipeline, security audit records')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
    logger.log(`Swagger OpenAPI Documentation available at http://localhost:${port}/api/docs`);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`PairUp Core Backend is running on: http://localhost:${port}/${apiPrefix.replace(/^\//, '')}`);
}

bootstrap();

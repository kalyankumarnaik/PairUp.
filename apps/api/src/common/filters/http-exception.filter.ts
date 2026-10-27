import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details: any = null;

    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (errorResponse && typeof errorResponse === 'object') {
      const respObj = errorResponse as any;
      message = respObj.message || message;
      code = respObj.error || code;
      details = respObj.details || null;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`[${status}] ${message}`, exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message.join(', ') : message,
      error: {
        code: String(code).toUpperCase().replace(/\s+/g, '_'),
        details: details || (Array.isArray(message) ? message : undefined)
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  }
}

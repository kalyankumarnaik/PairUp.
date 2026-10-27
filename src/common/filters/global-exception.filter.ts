import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '../exceptions/domain.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message: string | string[] = 'An unexpected internal error occurred';
    let details: unknown = undefined;

    if (exception instanceof DomainException) {
      statusCode = exception.getStatus();
      errorCode = exception.errorCode;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = (resObj.message as string | string[]) || exception.message;
        errorCode = (resObj.error as string) || (resObj.statusCode ? `HTTP_${resObj.statusCode}` : 'HTTP_EXCEPTION');
        details = resObj.details;
      } else {
        message = res as string;
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
      // In production, we mask raw system errors
      message = 'An unexpected internal server error occurred';
    }

    const errorPayload = {
      success: false,
      statusCode,
      error: errorCode,
      message,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorPayload);
  }
}

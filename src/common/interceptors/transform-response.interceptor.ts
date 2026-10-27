import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((result) => {
        // If already formatted or raw stream/buffer, return directly
        if (result && typeof result === 'object' && 'success' in result && 'timestamp' in result) {
          return result;
        }

        // If result contains paginated meta
        if (result && typeof result === 'object' && 'items' in result && 'meta' in result) {
          return {
            success: true,
            data: result.items,
            meta: result.meta,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          data: result,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

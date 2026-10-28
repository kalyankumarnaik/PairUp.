import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional({ example: 'Operation completed successfully' })
  message?: string;

  @ApiPropertyOptional()
  meta?: Record<string, unknown>;

  @ApiProperty({ example: '2026-10-27T05:30:00.000Z' })
  timestamp: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'AUTH_INVALID_CREDENTIALS' })
  error: string;

  @ApiProperty({ example: 'Invalid email or password' })
  message: string | string[];

  @ApiPropertyOptional()
  details?: unknown;

  @ApiProperty({ example: '/api/v1/auth/login' })
  path: string;

  @ApiProperty({ example: '2026-10-27T05:30:00.000Z' })
  timestamp: string;
}

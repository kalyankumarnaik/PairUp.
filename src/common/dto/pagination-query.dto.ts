import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, IsString } from 'class-validator';
import { SYSTEM_CONSTANTS } from '../constants/system.constant';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = SYSTEM_CONSTANTS.DEFAULT_PAGE;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(SYSTEM_CONSTANTS.MAX_PAGE_SIZE)
  limit?: number = SYSTEM_CONSTANTS.DEFAULT_PAGE_SIZE;

  @ApiPropertyOptional({ description: 'Cursor for keyset/cursor-based pagination' })
  @IsOptional()
  @IsString()
  cursor?: string;
}

export class PaginatedMetaDto {
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  limit?: number;

  @ApiPropertyOptional({ example: 150 })
  totalItems?: number;

  @ApiPropertyOptional({ example: 8 })
  totalPages?: number;

  @ApiPropertyOptional({ example: 'b5a22d3e-9087-4318-874b-417c805eb5cb' })
  nextCursor?: string | null;

  @ApiPropertyOptional({ example: true })
  hasNextPage: boolean;
}

export class PaginatedResultDto<T> {
  items: T[];
  meta: PaginatedMetaDto;
}

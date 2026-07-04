import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { APP_CONSTANTS } from '../constants/app.constants';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: APP_CONSTANTS.DEFAULT_PAGE_SIZE, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(APP_CONSTANTS.MAX_PAGE_SIZE)
  limit?: number = APP_CONSTANTS.DEFAULT_PAGE_SIZE;
}

export class CursorPaginationDto {
  @ApiPropertyOptional({ description: 'Cursor for next page' })
  @IsOptional()
  cursor?: string;

  @ApiPropertyOptional({ default: APP_CONSTANTS.DEFAULT_PAGE_SIZE, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(APP_CONSTANTS.MAX_PAGE_SIZE)
  limit?: number = APP_CONSTANTS.DEFAULT_PAGE_SIZE;
}

export class SearchQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort field' })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class ApiResponseDto<T> {
  @ApiProperty()
  success!: boolean;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  data!: T;
}

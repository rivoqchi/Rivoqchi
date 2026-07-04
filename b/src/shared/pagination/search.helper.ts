import { Prisma } from '@prisma/client';
import { SearchQuery } from '../../common/interfaces/pagination.interface';
import { PaginationHelper } from './pagination.helper';

export class SearchHelper {
  static buildSearchCondition(
    search: string | undefined,
    _fields: string[],
  ): Prisma.StringFilter | undefined {
    if (!search?.trim()) return undefined;

    return {
      contains: search.trim(),
    };
  }

  static buildWhereFromSearch<T extends Record<string, unknown>>(
    search: string | undefined,
    searchFields: (keyof T)[],
  ): Record<string, unknown> {
    if (!search?.trim() || searchFields.length === 0) {
      return {};
    }

    return {
      OR: searchFields.map((field) => ({
        [field]: {
          contains: search.trim(),
        },
      })),
    };
  }

  static buildOrderBy(
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc',
    allowedFields: string[] = ['createdAt'],
  ): Record<string, 'asc' | 'desc'> {
    const field = sortBy && allowedFields.includes(sortBy) ? sortBy : 'createdAt';
    return { [field]: sortOrder };
  }

  static buildFilters(filters?: Record<string, string>): Record<string, unknown> {
    if (!filters) return {};

    const where: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        where[key] = value;
      }
    }

    return where;
  }

  static getPaginationParams(query: SearchQuery): { skip: number; take: number; page: number; limit: number } {
    const page = PaginationHelper.normalizePage(query.page);
    const limit = PaginationHelper.normalizeLimit(query.limit);

    return {
      page,
      limit,
      skip: PaginationHelper.getSkip(page, limit),
      take: limit,
    };
  }
}

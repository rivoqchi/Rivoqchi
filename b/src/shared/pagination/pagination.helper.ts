import { PaginationMeta, CursorPaginationMeta } from '../../common/interfaces/pagination.interface';
import { APP_CONSTANTS } from '../../common/constants/app.constants';

export class PaginationHelper {
  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static buildMeta(total: number, page: number, limit: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  static buildCursorMeta(
    items: { id: string }[],
    limit: number,
    hasMore: boolean,
  ): CursorPaginationMeta {
    return {
      nextCursor: hasMore && items.length > 0 ? items[items.length - 1].id : null,
      hasNextPage: hasMore,
      limit,
    };
  }

  static normalizePage(page?: number): number {
    return page && page > 0 ? page : 1;
  }

  static normalizeLimit(limit?: number): number {
    if (!limit || limit < 1) return APP_CONSTANTS.DEFAULT_PAGE_SIZE;
    return Math.min(limit, APP_CONSTANTS.MAX_PAGE_SIZE);
  }
}

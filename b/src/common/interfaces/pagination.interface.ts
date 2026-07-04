export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface CursorPaginationQuery {
  cursor?: string;
  limit?: number;
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CursorPaginationMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
}

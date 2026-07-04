import { ApiResponse, PaginatedResponse } from '../common/interfaces/api-response.interface';
import { PaginationMeta } from '../common/interfaces/pagination.interface';

export class ResponseHelper {
  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static paginated<T>(
    data: T[],
    meta: PaginationMeta,
    message = 'Success',
  ): PaginatedResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }
}

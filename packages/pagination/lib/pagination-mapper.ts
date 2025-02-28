import type { PaginatedOffsetQuery } from './offset/paginated-offset.query.js'

export const DEFAULT_PAGINATION_MAX_LIMIT = 100

export interface TypeormPagination {
  skip: number
  take: number
}

export function typeormPagination (
  query?: PaginatedOffsetQuery | null,
  maxLimit = DEFAULT_PAGINATION_MAX_LIMIT
): TypeormPagination {
  const limit = Math.min(query?.limit ?? maxLimit, maxLimit)
  const offset = query?.offset ?? 0

  return {
    skip: offset,
    take: limit
  }
}

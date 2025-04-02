export interface PaginatedKeysetResponseMeta {
  next: string | object | null
  prev?: string | object | null
}

export interface PaginatedKeysetResponse {
  items: unknown[]
  meta: PaginatedKeysetResponseMeta
}

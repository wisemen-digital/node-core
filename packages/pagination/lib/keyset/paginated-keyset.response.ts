import { ApiProperty } from '@nestjs/swagger'

class PaginatedKeysetResponseMeta<T> {
  @ApiProperty({ description: 'the primary key of the last item of the current page', nullable: true })
  next: T | null

  constructor (nextKey: T | null) {
    this.next = nextKey
  }
}

export class PaginatedKeysetResponse<T, K extends keyof T> {
  @ApiProperty()
  items: T[]

  @ApiProperty({ type: PaginatedKeysetResponseMeta })
  meta: PaginatedKeysetResponseMeta<T[K]>

  constructor (items: T[], key: K) {
    this.items = items

    this.meta = new PaginatedKeysetResponseMeta(items.at(-1)?.[key] ?? null)
  }
}

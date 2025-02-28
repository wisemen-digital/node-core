import { ApiProperty } from '@nestjs/swagger'
import { isObject } from '@nestjs/common/utils/shared.utils.js'

export class PaginatedOffsetResponseMeta {
  @ApiProperty({ description: 'the total amount of items that exist' })
  total: number

  @ApiProperty({ description: 'the amount of items skipped' })
  offset: number

  @ApiProperty({ description: 'the amount of items per response' })
  limit: number

  constructor (total: number, offset: number, limit: number) {
    this.total = total
    this.offset = offset
    this.limit = limit
  }
}

export class PaginatedOffsetResponse<T> {
  @ApiProperty({ description: 'The items for the current page', isArray: true })
  items: T[]

  @ApiProperty({ type: PaginatedOffsetResponseMeta })
  meta: PaginatedOffsetResponseMeta

  constructor (items: T[], meta: PaginatedOffsetResponseMeta)
  constructor (items: T[], total: number, limit: number, offset: number)
  constructor (
    items: T[],
    totalOrMeta: number | PaginatedOffsetResponseMeta,
    limit?: number,
    offset?: number
  ) {
    this.items = items

    if (totalOrMeta instanceof PaginatedOffsetResponseMeta || isObject(totalOrMeta)) {
      this.meta = totalOrMeta
    } else {
      this.meta = new PaginatedOffsetResponseMeta(totalOrMeta, offset as number, limit as number)
    }
  }
}

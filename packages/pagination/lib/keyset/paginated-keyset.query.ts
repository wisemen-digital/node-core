import { Type } from 'class-transformer'
import { IsInt, IsPositive, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsUndefinable } from '@wisemen/validators'
import { SearchQuery } from '../../query/search.query.js'

export abstract class PaginatedKeysetQuery {
  @ApiProperty({ maximum: 100, minimum: 0 })
  @Type(() => Number)
  @IsUndefinable()
  @Max(100)
  @IsPositive()
  @IsInt()
  limit?: number

  abstract key?: string | object | null
}

export abstract class PaginatedKeysetSearchQuery extends SearchQuery {
  abstract pagination?: PaginatedKeysetQuery
}

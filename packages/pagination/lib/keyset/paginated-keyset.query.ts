import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, Max, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SearchQuery } from '../search.query.js'

export class PaginatedKeysetQuery {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @Max(100)
  @IsPositive()
  @IsInt()
  limit: number

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  key?: string
}

export abstract class PaginatedKeysetSearchQuery extends SearchQuery {
  @ApiProperty({ type: PaginatedKeysetQuery })
  @IsOptional()
  @Type(() => PaginatedKeysetQuery)
  @ValidateNested()
  pagination?: PaginatedKeysetQuery
}

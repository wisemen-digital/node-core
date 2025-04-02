import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum KeysetDirection {
  NEXT = 'next',
  PREV = 'prev'
}

export function KeysetDirectionApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: KeysetDirection,
    enumName: 'KeysetDirection'
  })
}

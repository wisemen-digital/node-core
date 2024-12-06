import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions } from 'typeorm'
import { TypeormTimeTransformer } from '@appwise/time'

export type TimeColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>

export function TimeColumn (options?: TimeColumnOptions): PropertyDecorator {
  return applyDecorators(
    Column({
      ...options,
      type: 'time',
      transformer: TimeTransformer.getInstance()
    })
  )
}

class TimeTransformer {
  private static instance: TypeormTimeTransformer | undefined

  public static getInstance (): TypeormTimeTransformer {
    if (TimeTransformer.instance === undefined) {
      TimeTransformer.instance = new TypeormTimeTransformer()
    }

    return TimeTransformer.instance
  }
}

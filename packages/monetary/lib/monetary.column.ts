import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions } from 'typeorm'
import { Monetary } from './monetary.js'

export type MonetaryColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>

export function MonetaryColumn <C extends string, P extends number> (
  currency: C, 
  precision: P, 
  options?: MonetaryColumnOptions
): PropertyDecorator {
  return applyDecorators(
    Column({
      ...options,
      type: 'int',
      transformer: new MoneyTypeOrmTransformer(precision, currency)
    })
  )
}

class MoneyTypeOrmTransformer <C extends string, P extends number> {
  constructor (
    private readonly precision: P,
    private readonly currency: C
  ) {}
  
  from (amount: number | null): Monetary<C, P> | null {
    if (amount === null) {
      return null
    }

    return new Monetary(amount, this.currency, this.precision)
  }

  to (monetary: Monetary<C, P> | null): number | null {
    if (monetary === null) {
      return null
    }

    return monetary.round().amount
  }
}

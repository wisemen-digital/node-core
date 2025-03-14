import { Column, ColumnOptions } from 'typeorm'
import { Monetary } from './monetary.js'
import { Currency } from './currency.enum.js'
import { PrecisionLossError } from './precision-loss-error.js'
import { UnsupportedCurrencyError } from './unsupported-currency-error.js'

export type MonetaryAmountColumnOptions = {
  currency: Currency
  monetaryPrecision: number
} & Omit<ColumnOptions, 'type' | 'transformer'>

/** Stores the amount as an int */
export function MonetaryAmountColumn (options: MonetaryAmountColumnOptions): PropertyDecorator {
  return Column({
    ...options,
    type: 'int',
    transformer: new MoneyTypeOrmAmountTransformer(options.currency, options.monetaryPrecision)
  })
}

export class MoneyTypeOrmAmountTransformer {
  public constructor (
    private readonly currency: Currency,
    private readonly precision: number
  ) {
    if (!Number.isInteger(this.precision)) {
      throw new Error('precision must be an integer')
    }
  }

  from (amount: number | null): Monetary | null {
    if (amount === null) {
      return null
    }

    return new Monetary(amount, this.currency, this.precision)
  }

  to (monetary: Monetary | null | undefined): number | null | undefined {
    if (monetary === undefined || monetary === null) {
      return monetary
    }

    if (monetary.currency !== this.currency) {
      throw new UnsupportedCurrencyError(monetary.currency)
    }

    if (monetary.precision > this.precision) {
      throw new PrecisionLossError()
    }

    const normalizedAmount = monetary.toPrecision(this.precision)

    if (!normalizedAmount.isRounded()) {
      throw new Error('Attempting to store a non rounded monetary value!')
    }

    return normalizedAmount.amount
  }
}

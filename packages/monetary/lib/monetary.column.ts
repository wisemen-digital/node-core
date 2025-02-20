import { Column, ColumnOptions } from 'typeorm'
import { Monetary } from './monetary.js'
import { Currency } from './currency.enum.js'
import { PrecisionLossError } from './precision-loss-error.js'

export type EmbeddedMonetaryOptions = {
  currencyPrecisions?: Record<Currency, number>
  defaultPrecision: number
} & Omit<ColumnOptions, 'type' | 'transformer'>


/** Stores the amount and currency as jsonb */
export function MonetaryColumn(options: EmbeddedMonetaryOptions): PropertyDecorator {
  return Column({
    ...options,
    type: 'jsonb',
    transformer: new MoneyTypeOrmTransformer(
      options.defaultPrecision,
      options.currencyPrecisions ?? {} as Record<Currency, number>
    )
  })

}

export interface EmbeddedMonetary {
  amount: number
  currency: Currency
}

export class MoneyTypeOrmTransformer {
  public constructor(
    private readonly defaultPrecision: number,
    private readonly currencyPrecision: Record<Currency, number>
  ) {
    if (
      !Number.isInteger(this.defaultPrecision)
      || Object.values(currencyPrecision).some(precision => !Number.isInteger(precision))
    ) {
      throw new Error('precision must be an integer')
    }
  }

  from(monetary: EmbeddedMonetary | null): Monetary | null {
    if (monetary === null) {
      return null
    }

    const precision = this.getPrecisionFor(monetary.currency)
    return new Monetary(monetary.amount, monetary.currency, precision)
  }

  to(monetary: Monetary | null): EmbeddedMonetary | null {
    if (monetary === null) {
      return null
    }

    if (!monetary.isRounded()) {
      throw new Error('Attempting to store a non rounded monetary value!')
    }

    const precision = this.getPrecisionFor(monetary.currency)
    if(precision > monetary.precision) {
      throw new PrecisionLossError()
    }


    const normalizedMonetary = monetary.toPrecision(precision)
    return {
      amount: normalizedMonetary.amount,
      currency: normalizedMonetary.currency
    }
  }

  private getPrecisionFor(currency: Currency) {
    return this.currencyPrecision[currency] ?? this.defaultPrecision
  }
}

import { Column, ColumnOptions } from 'typeorm'
import { Monetary } from './monetary.js'
import { Currency } from './currency.enum.js'

type EmbeddedMonetaryOptions = {
  storeCurrencyName: true
  currencyPrecisions?: Record<Currency, number>
  defaultPrecision: number
} & Omit<ColumnOptions, 'type' | 'transformer'>

type AmountColumnOptions = {
  storeCurrencyName: false,
  currency: Currency,
  precision: number
} & Omit<ColumnOptions, 'type' | 'transformer'>

export type MonetaryColumnOptions = (EmbeddedMonetaryOptions | AmountColumnOptions)

/**
 * Storing both the amount and currency code stores the column as `jsonb`.
 * Storing only the amount stores the amount as an `int`
 */
export function MonetaryColumn(options: MonetaryColumnOptions): PropertyDecorator {
  if (options.storeCurrencyName) {
    return Column({
      ...options,
      type: 'jsonb',
      transformer: new MoneyTypeOrmTransformer(
        options.defaultPrecision,
        options.currencyPrecisions ?? {} as Record<Currency, number>
      )
    })
  } else {
    return Column({
      ...options,
      type: 'int',
      transformer: new MoneyTypeOrmAmountTransformer(options.currency, options.precision)
    })
  }
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


export class MoneyTypeOrmAmountTransformer {
  public constructor(
    private readonly currency: Currency,
    private readonly precision: number
  ) {
    if (!Number.isInteger(this.precision)) {
      throw new Error('precision must be an integer')
    }
  }

  from(amount: number | null): Monetary | null {
    if (amount === null) {
      return null
    }

    return new Monetary(amount, this.currency, this.precision)
  }

  to(monetary: Monetary | null): number | null {
    if (monetary === null) {
      return null
    }

    if (!monetary.isRounded()) {
      throw new Error('Attempting to store a non rounded monetary value!')
    }

    return monetary.toPrecision(this.precision).amount
  }
}

import { Currency } from './currency.enum.js'

export class UnsupportedCurrencyError extends Error {
  constructor (currency: Currency) {
    super(
      `Cannot store a monetary value with currency ${currency}.\n`
      + 'Is the monetary column configured correctly on the entity?\n'
    )
  }
}

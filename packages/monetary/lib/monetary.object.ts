import { Currency } from './currency.enum.js'

export interface MonetaryObject<C extends Currency> {
  amount: number
  currency: C
  precision: number
}

import { Currency } from './lib/currency.enum.js'

export class IllegalMonetaryOperationError extends Error {
  constructor() {
    super("This operation is not supported between different currency types")
  }
}


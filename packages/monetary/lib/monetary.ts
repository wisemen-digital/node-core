import assert from 'node:assert'
import { MonetaryObject } from './monetary.object.js'
import { Currency } from './currency.enum.js'
import { IllegalMonetaryOperationError } from './illegal-monetary-operation.error.js'

export class Monetary<C extends Currency = Currency> {
  readonly currency: C
  readonly amount: number
  readonly precision: number

  constructor (object: MonetaryObject<C>)
  constructor (amount: number, currency: C, precision: number)
  constructor (
    objectOrAmount: MonetaryObject<C> | number,
    currency?: C,
    precision?: number
  ) {
    if (typeof objectOrAmount === 'object') {
      this.amount = objectOrAmount.amount
      this.currency = objectOrAmount.currency
      this.precision = objectOrAmount.precision
    } else {
      this.amount = objectOrAmount
      this.currency = currency!
      this.precision = precision!
    }

    if (!Number.isInteger(this.precision)) {
      throw new Error('precision must be an integer')
    }
  }

  valueOf (): number {
    return this.amount / 10 ** this.precision
  }

  equal (other: Monetary<C>): boolean {
    return this.isEqual(other)
  }

  isEqual (other: Monetary<C>): boolean {
    return this.performOperation(other, (_, left, right) => left === right)
  }

  isLessThan (other: Monetary<C>): boolean {
    return this.performOperation(other, (_, left, right) => left < right)
  }

  isLessThanOrEqual (other: Monetary<C>): boolean {
    return this.performOperation(other, (_, left, right) => left <= right)
  }

  isMoreThan (other: Monetary<C>): boolean {
    return this.performOperation(other, (_, left, right) => left > right)
  }

  isMoreThanOrEqual (other: Monetary<C>): boolean {
    return this.performOperation(other, (_, left, right) => left >= right)
  }

  /** Creates a new Monetary with the highest precision and sum of both amounts */
  add (other: Monetary<C>): Monetary<C> {
    return this.performOperation(other, (precision, left, right) =>
      new Monetary(left + right, this.currency, precision)
    )
  }

  /** Creates a new Monetary with the highest precision and difference of both amounts */
  subtract (other: Monetary<C>): Monetary<C> {
    return this.performOperation(other, (precision, left, right) =>
      new Monetary(left - right, this.currency, precision)
    )
  }

  /** Multiplies the amount, does not round the amount in the result */
  multiply (multiplier: number): Monetary<C> {
    return new Monetary(this.amount * multiplier, this.currency, this.precision)
  }

  /**
   * Change the precision of the monetary value
   * @post Does not round, ceil nor floor the resulting amount
   */
  toPrecision (newPrecision: number): Monetary<C> {
    assert(Number.isInteger(newPrecision))

    return new Monetary(this.adjustAmountToPrecision(newPrecision), this.currency, newPrecision)
  }

  /** Ceils the amount to the nearest integer for the current precision */
  ceil (): Monetary<C> {
    return new Monetary<C>(Math.ceil(this.amount), this.currency, this.precision)
  }

  /** Rounds the amount half up to the nearest integer for the current precision */
  round (): Monetary<C> {
    return new Monetary(Math.round(this.amount), this.currency, this.precision)
  }

  /** Floors the amount to the nearest integer for the current precision */
  floor (): Monetary<C> {
    return new Monetary<C>(Math.floor(this.amount), this.currency, this.precision)
  }

  /** Checks whether the amount is an integer */
  isRounded (): boolean {
    return Number.isInteger(this.amount)
  }

  toString (): string {
    return `${this.valueOf().toFixed(this.precision)} ${this.currency}`
  }

  export (): MonetaryObject<C> {
    return {
      amount: this.amount,
      currency: this.currency,
      precision: this.precision
    }
  }

  private performOperation<T> (
    other: Monetary<C>,
    operation: (precision: number, left: number, right: number) => T
  ): T {
    assert(this.currency === other.currency, new IllegalMonetaryOperationError())

    const highestPrecision = Math.max(this.precision, other.precision)
    const thisAmount = this.adjustAmountToPrecision(highestPrecision)
    const otherAmount = other.adjustAmountToPrecision(highestPrecision)

    return operation(highestPrecision, thisAmount, otherAmount)
  }

  private adjustAmountToPrecision (precision: number): number {
    const scaleDifference = precision - this.precision

    // Decrease in precision is done through a division to increase
    // floating point accuracy because we eliminate 1 floating point.
    // Increase of precision is done through multiplication because
    // 10 ** scaleDifference results in an integer
    if (scaleDifference < 0) {
      return this.amount / (10 ** Math.abs(scaleDifference))
    } else if (scaleDifference > 0) {
      return this.amount * (10 ** scaleDifference)
    } else {
      return this.amount
    }
  }
}

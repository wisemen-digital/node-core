import { MonetaryDto } from "./monetary.dto.js"
import { MonetaryObject } from "./monetary.object.js"

export class Monetary<C extends string, P extends number> {
  readonly amount: number
  readonly currency: C
  readonly precision: P
  
  constructor(object: MonetaryObject<C, P>)
  constructor(amount: number, currency: C, precision: P)
  constructor(
    objectOrAmount: MonetaryObject<C, P> | number,
    currency?: C, 
    precision?: P
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
  }

  valueOf (): number {
    return this.amount / 10 ** this.precision
  }

  equals (money: Monetary<C, P>): boolean {
    return this.amount === money.amount
  }

  add (money: Monetary<C, P>): Monetary<C, P> {
    return new Monetary(this.amount + money.amount, this.currency, this.precision)
  }

  subtract (money: Monetary<C, P>): Monetary<C, P> {
    return new Monetary(this.amount - money.amount, this.currency, this.precision)
  }

  multiply (multiplier: number): Monetary<C, P> {
    return new Monetary(this.amount * multiplier, this.currency, this.precision)
  }

  round (): Monetary<C, P> {
    return new Monetary(Math.round(this.amount), this.currency, this.precision)
  }

  toString (): string {
    return `${this.valueOf().toFixed(this.precision)} ${this.currency}`
  }

  export (): MonetaryDto {
    return new MonetaryDto(this.round())
  }
}


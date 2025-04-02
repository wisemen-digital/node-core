import { FindOperator, JsonContains } from 'typeorm'
import { Monetary } from './monetary.js'
import { Currency } from './currency.enum.js'
import { EmbeddedMonetary } from './monetary.column.js'

type MonetaryContainsOptions = {
  amount?: FindOperator<EmbeddedMonetary['amount']> | EmbeddedMonetary['amount']
  currency?: FindOperator<EmbeddedMonetary['currency']> | EmbeddedMonetary['currency']
}

export function MonetaryContains<C extends Currency> (
  value: MonetaryContainsOptions
): FindOperator<Monetary<C>> {
  return JsonContains(value) as FindOperator<Monetary<C>>
}

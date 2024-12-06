import { Any, FindOperator } from 'typeorm'

export function AnyOrIgnore<T> (values?: T[]): FindOperator<T> | undefined {
  return values != null ? Any(values) : undefined
}

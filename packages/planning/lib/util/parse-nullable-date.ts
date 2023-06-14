import moment, { Moment } from 'moment'

export function parseNullableDate (date: string | null, format: string): Moment | null {
  if (date === null) return null
  return moment(date, format)
}

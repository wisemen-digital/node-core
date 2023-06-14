import type { Moment } from 'moment'

export interface DatePeriod {
  start: Moment
  end: Moment | null
}

export function doDatePeriodsOverlap (
  firstPeriod: DatePeriod,
  secondPeriod: DatePeriod
): boolean {
  // if both periods have no end date (i.e. are infinite)
  if (firstPeriod.end === null && secondPeriod.end === null) return true
  // first period is infinite
  else if (firstPeriod.end === null) return firstPeriod.start.isSameOrBefore(secondPeriod.end)
  // second period is infinite
  else if (secondPeriod.end === null) return secondPeriod.start.isSameOrBefore(firstPeriod.end)
  // both periods are finite
  return firstPeriod.start.isSameOrBefore(secondPeriod.end) &&
    firstPeriod.end.isSameOrAfter(secondPeriod.start)
}

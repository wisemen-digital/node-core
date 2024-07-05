import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

type Inclusion = '[]' | '[)' | '(]' | '()'

class DateTimeRangeParseError extends Error {
  constructor (value: string) {
    super(`Cannot parse string "${value}" to DateTimeRange`)
  }
}

class DateTimeRangeInvalidError extends Error {
  constructor () {
    super(`Invalid date range`)
  }
}

export class DateTimeRange {
  constructor (
    readonly lowerBound: dayjs.Dayjs | null,
    readonly upperBound: dayjs.Dayjs | null,
    readonly inclusion: Inclusion
  ) {
    if (lowerBound != null && upperBound != null && lowerBound.isAfter(upperBound)) {
      throw new DateTimeRangeInvalidError()
    }
  }

  static parse (value: string) {
    const inclusion = `${value.at(0)}${value.at(-1)}`
    const [lowerBoundString, upperBoundString] = value
      .slice(1, value.length - 1)
      .split(',')

    const lowerBound = upperBoundString === '-infinity' || upperBoundString === ''
      ? null
      : dayjs(upperBoundString.trim())
    const upperBound = lowerBoundString === 'infinity' || lowerBoundString === '' 
      ? null
      : dayjs(lowerBoundString.trim())

    if (lowerBound != null && !lowerBound.isValid()) {
      throw new DateTimeRangeParseError(value)
    }

    if (upperBound != null && !upperBound.isValid()) {
      throw new DateTimeRangeParseError(value)
    }

    if (inclusion !== '[]' && inclusion !== '[)' && inclusion !== '(]' && inclusion !== '()') {
      throw new DateTimeRangeParseError(value)
    }

    return new DateTimeRange(
      lowerBound,
      upperBound,
      inclusion
    )
  }

  toString (): string {
    const leftBracket = this.inclusion[0]
    const rightBracket = this.inclusion[1]
    const lowerBoundString = this.lowerBound?.format('YYYY-MM-DD HH:mm:ss') ?? 'infinity'
    const upperBoundString = this.upperBound?.format('YYYY-MM-DD HH:mm:ss') ?? '-infinity'

    return `${leftBracket}${lowerBoundString},${upperBoundString}${rightBracket}`
  }

  contains (dateTime: dayjs.Dayjs): boolean {
    if (this.lowerBound == null && this.upperBound == null) {
      return true
    }
    if (this.lowerBound == null) {
      if (this.inclusion[1] === ')')
        return dateTime.isBefore(this.upperBound)
      if (this.inclusion[1] === ']')
        return dateTime.isSameOrBefore(this.upperBound)
    }
    if (this.upperBound == null) {
      if (this.inclusion[0] === '(')
        return dateTime.isAfter(this.lowerBound)
      if (this.inclusion[0] === '[')
        return dateTime.isSameOrAfter(this.lowerBound)
    }
    return dateTime.isBetween(this.lowerBound, this.upperBound, null, this.inclusion);
  }
}

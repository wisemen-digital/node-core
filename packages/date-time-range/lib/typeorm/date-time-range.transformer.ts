import { DateTimeRange } from "../date-time-range.js"

export class DateTimeRangeTypeOrmTransformer {
  from (value: string | null): DateTimeRange | null {
    if (value === null) {
      return null
    }
    return DateTimeRange.parse(value)
  }

  to (value: DateTimeRange | null): string | null {
    if (value === null) {
      return null
    }
    return value.toString()
  }
}
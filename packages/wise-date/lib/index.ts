import minMax from 'dayjs/plugin/minMax.js';
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import dayOfYear from 'dayjs/plugin/dayOfYear.js';
import isToday from 'dayjs/plugin/isToday.js';
import isTomorrow from 'dayjs/plugin/isTomorrow.js';
import isYesterday from 'dayjs/plugin/isYesterday.js';
import duration from 'dayjs/plugin/duration.js'
dayjs.extend(minMax)
dayjs.extend(weekOfYear)
dayjs.extend(dayOfYear)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)
dayjs.extend(isYesterday)
dayjs.extend(duration)


export * from './wise-date.js'
export * from './future-infinity-date.js'
export * from './past-infinity-date.js'
export * from './plain-date-object.js'
export * from './inclusivity.js'
export * from './date-range.js'
export * from './date-range-errors.js'
export * from './invalid-date.js'

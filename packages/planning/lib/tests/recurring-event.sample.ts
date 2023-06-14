import moment from "moment"
import { YYYY_MM_DD } from '../constants.js'
import { RecurringEvent } from '../recurring-event.js'

export function createRecurringEvent(withValues?: Partial<RecurringEvent>): RecurringEvent {
  return {
    isRecurring: true,
    startDate: moment().format(YYYY_MM_DD),
    endDate: moment().add(1,'week').format(YYYY_MM_DD),
    weeksPeriod: 1,
    ...withValues
  }
}

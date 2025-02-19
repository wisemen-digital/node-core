import moment from "moment"
import { YYYY_MM_DD } from '../../constants.js'
import { RecurringEvent } from '../../recurring-event.js'
import {Time} from "@wisemen/time";
import {defaultToIfUndefined} from "../../util/default-to-if-undefined.js";

export function createRecurringEvent(withValues?: Partial<RecurringEvent>): RecurringEvent {
  return {
    isRecurring: true,
    startDate: defaultToIfUndefined(withValues?.startDate, moment().format(YYYY_MM_DD)),
    endDate: defaultToIfUndefined(withValues?.endDate, moment().add(1,'week').format(YYYY_MM_DD)),
    weeksPeriod: defaultToIfUndefined(withValues?.weeksPeriod, 1),
    exceptions: defaultToIfUndefined(withValues?.exceptions, []),
    startTime: defaultToIfUndefined(withValues?.startTime, new Time('09:00:00')),
    endTime: defaultToIfUndefined(withValues?.endTime, new Time('10:00:00'))
  }
}



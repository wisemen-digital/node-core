import {PlanningEvent} from '../../planning-event.js'
import moment from 'moment'
import { YYYY_MM_DD } from '../../constants.js'
import {defaultToIfUndefined} from "../../util/default-to-if-undefined.js";
import {Time} from "@wisemen/time";

export function createPlanningEvent(withValues?: Partial<PlanningEvent>): PlanningEvent {
  return {
    isRecurring: false,
    startDate: defaultToIfUndefined(withValues?.startDate, moment().format(YYYY_MM_DD)),
    endDate: defaultToIfUndefined(withValues?.endDate, moment().format(YYYY_MM_DD)),
    weeksPeriod: defaultToIfUndefined(withValues?.weeksPeriod, null),
    exceptions: defaultToIfUndefined(withValues?.exceptions, []),
    startTime: defaultToIfUndefined(withValues?.startTime, new Time('09:00:00')),
    endTime: defaultToIfUndefined(withValues?.endTime, new Time('10:00:00'))
  }
}

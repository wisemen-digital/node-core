import {PlanningEvent} from '../planning-event.js'
import moment from 'moment'
import { YYYY_MM_DD } from '../constants.js'

export function createPlanningEvent(withValues?: Partial<PlanningEvent>): PlanningEvent {
  return {
    isRecurring: false,
    startDate: moment().format(YYYY_MM_DD),
    endDate: moment().format(YYYY_MM_DD),
    weeksPeriod: null,
    ...withValues
  }
}

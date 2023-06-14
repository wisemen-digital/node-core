import { Time } from '@appwise/time'
import {PlanningException} from './planning-exceptions.js'

export interface PlanningEvent {
  weeksPeriod: number | null
  isRecurring: boolean
  startDate: string
  endDate: string | null
  startTime: Time
  endTime: Time
  exceptions: PlanningException[]
}

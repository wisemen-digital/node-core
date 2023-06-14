import {PlanningEvent} from "./planning-event.js";

export interface RecurringEvent extends PlanningEvent {
  weeksPeriod: number
  isRecurring: true
}

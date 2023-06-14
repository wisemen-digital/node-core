export interface PlanningEvent {
  weeksPeriod: number | null
  isRecurring: boolean
  startDate: string
  endDate: string | null
}

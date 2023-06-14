import {PlanningException} from "../../planning-exceptions.js";
import {defaultToIfUndefined} from "../../util/default-to-if-undefined.js";

export function createPlanningEventException(withValues?: Partial<PlanningException>): PlanningException {
  return {
    exceptionDate: defaultToIfUndefined(withValues?.exceptionDate, '2023-06-14')
  }
}

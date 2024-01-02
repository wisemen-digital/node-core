import {DateRange} from "./date-range.js";

export class InvalidBounds extends Error {
  constructor(
    private dateRange: DateRange
  ) {
    super();
  }
}

export class NoOverlap extends Error {
  constructor(
    private firstRange: DateRange,
    private secondRange: DateRange
  ) {
    super();
  }
}

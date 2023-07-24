import {PlainDateObject} from "./plain-date-object";
import {WiseDate} from "./date";

export class InvalidDate extends Error {
  public constructor(
   public readonly date: WiseDate
  ) {
    super(`Invalid date: ${date.format('YYYY-MM-DD')}`)
  }
}

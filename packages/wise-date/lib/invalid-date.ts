import {PlainDateObject} from "./plain-date-object.js";
import {WiseDate} from "./wise-date.js";

export class InvalidDate extends Error {
  public constructor(
   public readonly date: WiseDate
  ) {
    super(`Invalid date: ${date.format('YYYY-MM-DD')}`)
  }
}

import plugin, {AddDurationType, DurationUnitType} from "dayjs/plugin/duration.js";
import dayjs from "dayjs";
import {DateUnit} from "./units.js";

export class Duration {
  private readonly duration: plugin.Duration

  constructor(duration: plugin.Duration)
  constructor(amount: number, unit: DateUnit)
  constructor (input: number | plugin.Duration, unit?: DurationUnitType) {
    if(typeof input === "number") {
      this.duration = dayjs.duration(input,unit)
    } else {
      this.duration = input.clone()
    }
  }

  get days(): number {
    return this.duration.days()
  }

  get weeks(): number {
    return this.duration.weeks()
  }

  get months(): number {
    return this.duration.months()
  }

  get years(): number {
    return this.duration.years()
  }

  public add(duration: Duration): Duration {
    return new Duration(this.duration.add(duration))
  }

  public subtract(duration: Duration): Duration {
    return new Duration(this.duration.subtract(duration))
  }

  public toISOString(): string {
    return this.duration.toISOString()
  }

  public toDayjsDuration(): plugin.Duration {
    return this.duration.clone()
  }
}

import { Time } from './time.js'

export class TimeError extends Error {
}

export class InvalidTimeString extends TimeError {
  constructor (invalidString: string) {
    super(`Invalid time string: ${invalidString} must match ${Time.STRING_FORMAT}`)
  }
}

export class InvalidBounds extends TimeError {
  constructor (lowerBound: Time, upperBound: Time) {
    super(`Invalid boundaries: ${lowerBound.toString()} must be before ${upperBound.toString()}`)
  }
}

export class InvalidAbsoluteSeconds extends TimeError {
  constructor (time: string) {
    super(`Invalid time ${time}`)
  }
}

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

export class InvalidHours extends TimeError {
  constructor (hours: number) {
    super(`Invalid hours: ${hours} must be between ${Time.MIN_HOURS} and ${Time.MAX_HOURS}`)
  }
}

export class InvalidMinutes extends TimeError {
  constructor (minutes: number) {
    super(`Invalid minutes: ${minutes} must be between ${Time.MIN_MINUTES} and ${Time.MAX_MINUTES}`)
  }
}

export class InvalidSeconds extends TimeError {
  constructor (seconds: number) {
    super(`Invalid seconds: ${seconds} must be between ${Time.MIN_SECONDS} and ${Time.MAX_SECONDS}`)
  }
}

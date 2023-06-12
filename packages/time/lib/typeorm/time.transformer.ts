import { Time } from '../time.js'

export class TypeormTimeTransformer {
  from (value: string | null): Time | null {
    if (Time.isValidTimeString(value)) {
      return Time.fromString(value as string)
    } else {
      return null
    }
  }

  to (value: Time): string {
    return value.toString()
  }
}

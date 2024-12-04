import { Time } from '../time.js'

export class TypeormTimeTransformer {
  from (value: string | null): Time | null {
    if (Time.isValidTimeString(value)) {
      return new Time(value as string)
    } else {
      return null
    }
  }

  to (value: Time | null): string | null {
    return value?.toString() ?? null
  }
}

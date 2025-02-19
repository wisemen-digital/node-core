import type { ValidationOptions } from 'class-validator'
import { ValidateIf } from 'class-validator'

export function IsUndefinable (validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_object, value) => value !== undefined, validationOptions)
}

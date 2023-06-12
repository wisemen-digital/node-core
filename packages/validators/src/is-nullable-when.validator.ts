/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ValidationOptions } from 'class-validator'
import { ValidateIf } from 'class-validator'

export function IsNullableWhen (
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  const nullableWhen = (object: any, value: any): boolean => {
    return value !== null || !condition(object, value)
  }

  return ValidateIf(nullableWhen, validationOptions)
}

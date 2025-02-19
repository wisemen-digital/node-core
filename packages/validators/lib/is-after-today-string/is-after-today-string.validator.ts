import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint
} from 'class-validator'
import dayjs from 'dayjs'

/**
   * Validate that the value is a string with format hh:mm:ss
   */
export function IsAfterTodayString (
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return Validate(IsAfterTodayStringValidator, validationOptions)
}

@ValidatorConstraint({ name: 'IsAfterTodayString', async: false })
export class IsAfterTodayStringValidator implements ValidatorConstraintInterface {
  validate (dateString: string, _args: ValidationArguments): boolean {
    if (typeof dateString !== 'string') return false

    const formattedDate = dayjs(dateString, 'YYYY-MM-DD')

    return formattedDate.isValid() && formattedDate.isAfter(dayjs(), 'day')
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a date after today`
  }
}

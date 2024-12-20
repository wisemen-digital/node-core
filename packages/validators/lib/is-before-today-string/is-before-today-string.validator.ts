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
export function IsBeforeTodayString (
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return Validate(IsBeforeTodayStringValidator, validationOptions)
}

@ValidatorConstraint({ name: 'IsBeforeTodayString', async: false })
export class IsBeforeTodayStringValidator implements ValidatorConstraintInterface {
  validate (dateString: string, _args: ValidationArguments): boolean {
    if (typeof dateString !== 'string') return false

    const formattedDate = dayjs(dateString, 'YYYY-MM-DD')

    return formattedDate.isValid() && formattedDate.isBefore(dayjs(), 'day')
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a date before today`
  }
}

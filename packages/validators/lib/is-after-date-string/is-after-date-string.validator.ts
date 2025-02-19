import {
  type ValidationOptions,
  type ValidatorConstraintInterface,
  type ValidationArguments,
  registerDecorator,
  ValidatorConstraint
} from 'class-validator'
import dayjs from 'dayjs'

export function IsAfterDateString (
  dateCallback: (argObject: object) => string | undefined,
  format: string = 'YYYY-MM-DD',
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback, format],
      options: validationOptions,
      validator: IsAfterDateStringValidator
    })
  }
}

export function isAfterDateString (
  dateString: string | undefined,
  args: ValidationArguments
): boolean {
  if (typeof dateString !== 'string') return false

  const mapFn = args.constraints[0] as (argObject: object) => string | undefined

  if (mapFn(args.object) == null) return true

  const dateToCheck = dayjs(dateString, 'YYYY-MM-DD')

  if (!dateToCheck.isValid()) return false

  const comparisonDateString = mapFn(args.object)

  if (comparisonDateString === null) return true

  const comparisonDate = dayjs(comparisonDateString, 'YYYY-MM-DD')

  if (!comparisonDate.isValid()) return false

  return dateToCheck.isAfter(comparisonDate)
}

@ValidatorConstraint({ name: 'isAfterDateString', async: false })
class IsAfterDateStringValidator implements ValidatorConstraintInterface {
  validate (date: string, args: ValidationArguments): boolean {
    return isAfterDateString(date, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const mapFn = args.constraints[0] as (argObject: object) => string | undefined

    const afterString = mapFn(args.object)

    return `${args.property} must be a date string after ${afterString}`
  }
}

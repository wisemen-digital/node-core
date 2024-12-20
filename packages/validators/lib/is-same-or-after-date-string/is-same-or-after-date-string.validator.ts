import {
  type ValidationOptions,
  type ValidatorConstraintInterface, type ValidationArguments, registerDecorator
  ,
  ValidatorConstraint
} from 'class-validator'
import dayjs from 'dayjs'

export function IsSameOrAfterDateString (
  dateCallback: (argObject: object) => string | undefined,
  format: string = 'YYYY-MM-DD',
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSameOrAfterDate',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback, format],
      options: validationOptions,
      validator: IsSameOrAfterDateStringValidator
    })
  }
}

export function isSameOrAfterDateString (
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

  return dateToCheck.isSame(comparisonDate, 'day') || dateToCheck.isAfter(comparisonDate, 'day')
}

@ValidatorConstraint({ name: 'isSameOrAfterDateString', async: false })
class IsSameOrAfterDateStringValidator implements ValidatorConstraintInterface {
  validate (date: string, args: ValidationArguments): boolean {
    return isSameOrAfterDateString(date, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const mapFn = args.constraints[0] as (argObject: object) => string | undefined

    const afterString: string = mapFn(args.object) as string

    return `${args.property} must be a date after or the same as ${afterString}`
  }
}

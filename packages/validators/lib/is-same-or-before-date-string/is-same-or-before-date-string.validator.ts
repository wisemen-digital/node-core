import {
  type ValidationOptions,
  type ValidatorConstraintInterface, type ValidationArguments, registerDecorator
  ,
  ValidatorConstraint
} from 'class-validator'
import dayjs from 'dayjs'

export function IsSameOrBeforeDateString (
  dateCallback: (argObject: object) => string | undefined,
  format: string = 'YYYY-MM-DD',
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSameOrBeforeDate',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback, format],
      options: validationOptions,
      validator: IsSameOrBeforeDateStringValidator
    })
  }
}

export function isSameOrBeforeDateString (
  dateString: string | undefined,
  args: ValidationArguments
): boolean {
  if (typeof dateString !== 'string') return false

  const mapFn = args.constraints[0] as (argObject: object) => string | undefined

  if (mapFn(args.object) == null) return true

  const dateToCheck = dayjs(dateString, 'YYYY-MM-DD')

  if (!dateToCheck.isValid()) return false

  const comparisonDateString = mapFn(args.object) as string

  if (comparisonDateString === null) return true

  const comparisonDate = dayjs(comparisonDateString, 'YYYY-MM-DD')

  if (!comparisonDate.isValid()) return false

  return dateToCheck.isSame(comparisonDate, 'day') || dateToCheck.isBefore(comparisonDate, 'day')
}

@ValidatorConstraint({ name: 'isSameOrBeforeDateString', async: false })
class IsSameOrBeforeDateStringValidator implements ValidatorConstraintInterface {
  validate (date: string, args: ValidationArguments): boolean {
    return isSameOrBeforeDateString(date, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const mapFn = args.constraints[0] as (argObject: object) => string | undefined

    const beforeString = mapFn(args.object)

    return `${args.property} must be a date before or the same as ${beforeString}`
  }
}

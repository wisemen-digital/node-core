import {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments, registerDecorator
  ,
  ValidatorConstraint
} from 'class-validator'
import dayjs from 'dayjs'

export function IsBeforeDateString (
  dateCallback: (argObject: object) => string | null,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBeforeDateString',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback],
      options: validationOptions,
      validator: IsDateWithoutTimeStringValidator
    })
  }
}

@ValidatorConstraint({ name: 'isBeforeDateString', async: false })
class IsDateWithoutTimeStringValidator implements ValidatorConstraintInterface {
  validate (dateString: unknown, args: ValidationArguments): boolean {
    if (typeof dateString !== 'string') return false

    const dateToCheck = dayjs(dateString)
    if (!dateToCheck.isValid()) return false

    const comparisonDateString = args.constraints[0](args.object)
    if (comparisonDateString === null) return false

    const comparisonDate = dayjs(comparisonDateString)
    if (!comparisonDate.isValid()) return false

    return dateToCheck.isBefore(comparisonDate)
  }

  defaultMessage (args: ValidationArguments): string {
    const beforeString: string = args.constraints[0](args.object)
    return `${args.property} must be a date string before ${beforeString}`
  }
}

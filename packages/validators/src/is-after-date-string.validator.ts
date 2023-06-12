import {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments, registerDecorator
  ,
  ValidatorConstraint
} from 'class-validator'
import moment from 'moment'

export function IsAfterDateString (
  dateCallback: (argObject: object) => string | null,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDateString',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback],
      options: validationOptions,
      validator: IsDateWithoutTimeStringValidator
    })
  }
}

@ValidatorConstraint({ name: 'isAfterDateString', async: false })
class IsDateWithoutTimeStringValidator implements ValidatorConstraintInterface {
  validate (dateString: unknown, args: ValidationArguments): boolean {
    if (typeof dateString !== 'string') return false

    const dateToCheck = moment(dateString)
    if (!dateToCheck.isValid()) return false

    const comparisonDateString = args.constraints[0](args.object)
    if (comparisonDateString === null) return false

    const comparisonDate = moment(comparisonDateString)
    if (!comparisonDate.isValid()) return false

    return dateToCheck.isAfter(comparisonDate)
  }

  defaultMessage (args: ValidationArguments): string {
    const afterString: string = args.constraints[0](args.object)
    return `${args.property} must be a date string after ${afterString}`
  }
}

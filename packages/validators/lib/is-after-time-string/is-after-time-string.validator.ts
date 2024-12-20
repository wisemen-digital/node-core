import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { Time } from '@appwise/time'

export function IsAfterTimeString (
  timeCallback: (argObject: object) => string | null,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterTimeString',
      target: object.constructor,
      propertyName,
      constraints: [timeCallback],
      options: validationOptions,
      validator: IsAfterTimeStringValidator
    })
  }
}

@ValidatorConstraint({ name: 'isAfterTimeString', async: false })
class IsAfterTimeStringValidator implements ValidatorConstraintInterface {
  validate (timeString: unknown, args: ValidationArguments): boolean {
    if (typeof timeString !== 'string') return false
    if (!Time.isValidTimeString(timeString)) return false

    const provideMinimumTime = args.constraints[0]
    const dto = args.object
    const minimumTimeString = provideMinimumTime(dto)
    if (!Time.isValidTimeString(minimumTimeString)) return false

    const minimumTime = new Time(minimumTimeString)
    const time = new Time(timeString)
    return time.isAfter(minimumTime)
  }

  defaultMessage (args: ValidationArguments): string {
    const afterString: string = args.constraints[0](args.object)
    return `${args.property} must be a time string after ${afterString}`
  }
}

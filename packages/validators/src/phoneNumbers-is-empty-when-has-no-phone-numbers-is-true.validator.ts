import {
  isArray,
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint
} from 'class-validator'
import type { ContactInfoDto } from '../../types/dtos/contact-info.dto.js'

export function PhoneNumbersIsEmptyWhenHasNoPhoneNumberIsTrue (
  options?: ValidationOptions
): PropertyDecorator {
  return Validate(PhoneNumbersIsEmptyWhenHasNoPhoneNumbersIsTrueValidator, options)
}

@ValidatorConstraint({ name: 'PhoneNumbersIsEmptyWhenHasNoPhoneNumberIsTrue', async: false })
class PhoneNumbersIsEmptyWhenHasNoPhoneNumbersIsTrueValidator {
  validate (phoneNumbers: unknown, args: ValidationArguments): boolean {
    const dto = args.object as ContactInfoDto
    if (dto.hasNoPhoneNumber) {
      return isArray(phoneNumbers) && phoneNumbers.length === 0
    } else {
      return true
    }
  }

  defaultMessage (): string {
    return 'phoneNumbers must be empty when hasNoPhoneNumbers is true'
  }
}

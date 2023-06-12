import {
  isArray,
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint
} from 'class-validator'
import type { ContactInfoDto } from '../../types/dtos/contact-info.dto.js'

export function HasAnEmailWhenNoPhoneNumberIsGiven (
  options?: ValidationOptions
): PropertyDecorator {
  return Validate(EmailIsNotEmptyWhenEmployeeHasNoPhoneNumberValidator, options)
}

@ValidatorConstraint({ name: 'EmailIsNotEmptyWhenEmployeeHasNoPhoneNumber', async: false })
class EmailIsNotEmptyWhenEmployeeHasNoPhoneNumberValidator {
  validate (emails: unknown, args: ValidationArguments): boolean {
    const dto = args.object as ContactInfoDto
    if (dto.hasNoPhoneNumber || (isArray(dto.phoneNumbers) && dto.phoneNumbers.length === 0)) {
      return isArray(emails) && emails.length !== 0
    } else {
      return true
    }
  }

  defaultMessage (): string {
    return 'must have at least one email when no phone numbers have been given'
  }
}

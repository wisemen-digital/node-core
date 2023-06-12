import {
  isArray,
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint
} from 'class-validator'
import type { ContactInfoDto } from '../../types/dtos/contact-info.dto.js'

export function HasAPhoneNumberWhenNoEmailIsGiven (
  options?: ValidationOptions
): PropertyDecorator {
  return Validate(HasAPhoneNumberWhenNoEmailIsGivenValidator, options)
}

@ValidatorConstraint({ name: 'HasAPhoneNumberWhenNoEmailIsGiven', async: false })
class HasAPhoneNumberWhenNoEmailIsGivenValidator {
  validate (phoneNumbers: unknown, args: ValidationArguments): boolean {
    const dto = args.object as ContactInfoDto
    if (dto.hasNoEmail || (isArray(dto.emails) && dto.emails.length === 0)) {
      return isArray(phoneNumbers) && phoneNumbers.length !== 0
    } else {
      return true
    }
  }

  defaultMessage (): string {
    return 'must have at least one phoneNumber when no emails have been given'
  }
}

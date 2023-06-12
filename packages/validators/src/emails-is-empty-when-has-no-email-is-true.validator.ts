import {
  isArray,
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint
} from 'class-validator'
import type { ContactInfoDto } from '../../types/dtos/contact-info.dto.js'

export function EmailsIsEmptyWhenHasNoEmailIsTrue (
  options?: ValidationOptions
): PropertyDecorator {
  return Validate(EmailIsEmptyWhenEmployeeHasNoEmailValidator, options)
}

@ValidatorConstraint({ name: 'EmailIsEmptyWhenEmployeeHasNoEmail', async: false })
class EmailIsEmptyWhenEmployeeHasNoEmailValidator {
  validate (emails: unknown, args: ValidationArguments): boolean {
    const dto = args.object as ContactInfoDto
    if (dto.hasNoEmail) {
      return isArray(emails) && emails.length === 0
    } else {
      return true
    }
  }

  defaultMessage (): string {
    return 'emails must be empty when hasNoEmail is true'
  }
}

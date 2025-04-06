import {
  type ValidatorConstraintInterface, type ValidationArguments,
  ValidatorConstraint,
  ValidationOptions,
  Validate
} from 'class-validator'

export function IsQueryBoolean (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsQueryBooleanValidator, validationOptions)
}

@ValidatorConstraint({ name: 'isQueryBoolean', async: false })
class IsQueryBooleanValidator implements ValidatorConstraintInterface {
  validate (booleanString: string, _args: ValidationArguments): boolean {
    return booleanString === 'true' || booleanString === 'false'
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a string of format 'true' or 'false'`
  }
}

import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface, isNumberString, Validate, ValidatorConstraint } from 'class-validator'

export interface IsMoneyStringValidationOptions extends ValidationOptions {
  maxValue?: number
  maxScale?: number
}

export function IsMoneyString (
  validationOptions?: IsMoneyStringValidationOptions
): PropertyDecorator {
  return Validate(
    IsMoneyStringValidator,
    [{
      maxValue: validationOptions?.maxValue,
      maxScale: validationOptions?.maxScale
    }],
    validationOptions
  )
}

export function isMoneyString (
  moneyString: unknown,
  maxScale?: number,
  maxValue?: number
): boolean {
  if (typeof moneyString !== 'string') return false
  if (!isNumberString(moneyString)) return false
  const [_integerPart, fractionalPart] = moneyString.split('.')

  if (
    maxScale !== undefined &&
    fractionalPart !== undefined &&
    fractionalPart.length > maxScale
  ) {
    return false
  }

  return maxValue === undefined || (Number(moneyString) <= maxValue)
}

interface ValidatorConstraints {
  maxValue?: number
  maxScale?: number
}

@ValidatorConstraint({ name: 'isDateWithoutTimeString', async: false })
class IsMoneyStringValidator implements ValidatorConstraintInterface {
  validate (moneyString: unknown, args: ValidationArguments): boolean {
    const { maxValue, maxScale }: ValidatorConstraints = args.constraints[0]

    return isMoneyString(moneyString, maxScale, maxValue)
  }

  defaultMessage (args: ValidationArguments): string {
    const { maxValue, maxScale }: ValidatorConstraints = args.constraints[0]
    const maxValueString = (maxValue != null) ? ` with a max value of ${maxValue}` : ''
    const maxScaleString = (maxScale != null) ? ` with a max scale of ${maxScale}` : ''
    return `${args.property} a must be a numeric string${maxValueString}${maxScaleString}`
  }
}

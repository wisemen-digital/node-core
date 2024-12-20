import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  registerDecorator,
  ValidatorConstraint
} from 'class-validator'

type IsNullWhenConstraint = ConditionalWhen | ValueBasedWhen
interface ConditionalWhen {
  conditionOrProperty: ConditionFunction
  expectedValue: never
}
interface ValueBasedWhen {
  conditionOrProperty: string
  expectedValue: unknown
}

type ConditionFunction = (object: unknown, value: unknown) => boolean
type ConditionOrProperty = string | ConditionFunction

/**
 * Validate that a property is null when another property has the specified value
 * Comparison with the expected value is performed through 'property === expectedValue'
 * @param condition The condition to check against, when true, the property must be null
 */
export function IsNullWhen (
  condition: ConditionFunction,
  _?: never,
  validationOptions?: ValidationOptions
): PropertyDecorator
/**
 * Validate that a property is null when another property has the specified value
 * Comparison with the expected value is performed through 'property === expectedValue'
 * @param property the name of the property
 * @param hasValue the deciding value for the property
 */
export function IsNullWhen (
  property: string,
  hasValue: unknown,
  validationOptions?: ValidationOptions
): PropertyDecorator
export function IsNullWhen (
  conditionOrProperty: ConditionOrProperty,
  hasValue?: unknown,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNullWhen',
      target: object.constructor,
      propertyName,
      constraints: [{ conditionOrProperty, expectedValue: hasValue }],
      options: validationOptions,
      validator: IsNullWhenValidator
    })
  }
}

@ValidatorConstraint({ name: 'isNullWhen', async: false })
class IsNullWhenValidator implements ValidatorConstraintInterface {
  validate (property: unknown, args: ValidationArguments): boolean {
    const constraint: IsNullWhenConstraint = args.constraints[0]

    const propertyMustBeNull = this.mustBeNull(constraint, args.object)
    return (!propertyMustBeNull) || (propertyMustBeNull && property === null)
  }

  defaultMessage (args: ValidationArguments): string {
    const constraint: IsNullWhenConstraint = args.constraints[0]
    if (this.isConditionalWhen(constraint)) {
      return `${args.property} must be null when the condition is met`
    }

    return `${args.property} must be null when ${constraint.conditionOrProperty} is ${constraint.expectedValue as string}`
  }

  private mustBeNull (constraint: IsNullWhenConstraint, object: object): boolean {
    if (this.isConditionalWhen(constraint)) {
      return constraint.conditionOrProperty(object, null)
    }
    return object[constraint.conditionOrProperty] === constraint.expectedValue
  }

  private isConditionalWhen (nullOptions: IsNullWhenConstraint): nullOptions is ConditionalWhen {
    return typeof nullOptions.conditionOrProperty === 'function'
  }
}

import { ValidationError } from 'class-validator'
import { ErrorContent } from './types.js'

export function convertValidationError (errors: ValidationError[], path = '$'): ErrorContent[] {
  if (!errors) return errors

  const convertedErrors: ErrorContent[] = []

  for (const error of errors) {
    const isArray = Array.isArray(error.target)

    const jsonpath = path + (isArray ? `[${error.property}]` : `.${error.property}`)

    if (error.children === undefined || error.children.length === 0) {
      if (error.constraints !== undefined) {
        convertedErrors.push({
          source: { pointer: jsonpath },
          code: 'validation_error',
          detail: Object.values(error.constraints)[0]
        })
      }
    } else {
      convertedErrors.push(...convertValidationError(error.children, jsonpath))
    }
  }

  return convertedErrors
}

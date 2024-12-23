import { ValidationError } from 'class-validator'
import { convertValidationError } from './convert.js'
import { defaultErrors } from './default-errors.js'
import { ErrorContent, ErrorList, ErrorResponse } from './types.js'

export class CustomError <T extends string> extends Error {
  static errors: ErrorList = defaultErrors

  status?: number
  errors: ErrorContent[] = []

  constructor (code: T|T[]|ValidationError[], id?: string) {
    super()

    if (typeof code === 'string') {
      this.errors.push(this.getError(code))
    } else if (Array.isArray(code)) {
      for (const c of code) {
        if (c instanceof ValidationError) {
          this.errors.push(...convertValidationError([c]))
        } else {
          this.errors.push(this.getError(c))
        }
      }
    }
  }

  private getError (code: T): ErrorContent {
    if (!(code in CustomError.errors)) {
      throw new Error(`Error ${code} is not defined`)
    }

    const error = CustomError.errors[code]

    this.status = error.status

    return {
      code,
      detail: error.detail
    }
  }

  setDesc (desc: string) {
    this.errors[0].detail = desc

    return this
  }

  get response (): ErrorResponse {
    return {
      errors: this.errors
    }
  }
}


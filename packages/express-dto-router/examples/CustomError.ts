import { CustomError , defaultErrors } from '../lib/index.js'

const list = {
  ...defaultErrors,
  validation_error: {
    detail: 'Validation error',
    status: 400
  },
  not_found: {
    detail: 'Not found',
    status: 404
  },
}

type listTypes = keyof typeof list

export class KnownError extends CustomError<listTypes> {
  static errors = list
}

new CustomError('not_found')

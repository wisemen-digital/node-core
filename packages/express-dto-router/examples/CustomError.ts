import { CustomError , defaultErrors } from '../lib/index.js'

const list = {
  ...defaultErrors,
  validation_error: {
    description: 'Validation error',
    status: 400
  },
  not_found: {
    description: 'Not found',
    status: 404
  },
}

type listTypes = keyof typeof list

export class KnownError extends CustomError<listTypes> {
  static errors = list
}

new CustomError('not_found')

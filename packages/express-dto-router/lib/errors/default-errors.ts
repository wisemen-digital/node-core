export const defaultErrors = {
  validation_error: {
    status: 400,
    detail: 'Validation error'
  },
  invalid_uuid: {
    detail: 'The uuid provided is not a valid uuid',
    status: 400
  },
  missing_parameters: {
    detail: 'Missing parameters for required field',
    status: 400
  },
  invalid_data: {
    detail: 'Invalid data provided',
    status: 400
  },
  email_exists: {
    detail: 'The email provided already exists',
    status: 409
  },
  invalid_token: {
    detail: 'The token provided is not valid',
    status: 401
  },
  invalid_credentials: {
    detail: 'The credentials provided are invalid',
    status: 401
  },
  not_found: {
    detail: 'The resource could not be found',
    status: 404
  },
  missing_scope: {
    detail: 'The scope provided is missing or invalid',
    status: 403
  },
  unauthorized: {
    detail: 'The user needs to be authorized to perform this action',
    status: 401
  },
  forbidden: {
    detail: 'The user is not allowed to perform this action',
    status: 403
  },
  invalid_parameters: {
    detail: 'The parameters provided are invalid',
    status: 400
  },
  email_error: {
    detail: 'There was an error sending the email',
    status: 500
  },
  already_exists: {
    detail: 'Entity already exists',
    status: 409
  },
  invalid_geometric: {
    detail: 'Geometric object is invalid',
    status: 400
  },
  invalid_sizing: {
    detail: 'Unable to calculate dimensions',
    status: 400
  }
}

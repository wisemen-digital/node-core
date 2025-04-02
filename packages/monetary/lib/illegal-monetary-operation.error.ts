export class IllegalMonetaryOperationError extends Error {
  constructor () {
    super('This operation is not supported between different currency types')
  }
}

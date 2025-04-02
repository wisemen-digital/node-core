export class PrecisionLossError extends Error {
  constructor () {
    super('Cannot lower the precision of a monetary value')
  }
}

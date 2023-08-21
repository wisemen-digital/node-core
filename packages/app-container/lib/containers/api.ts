/* eslint-disable no-console */
import { type Express } from 'express'
import { DefaultContainer } from './default.js'

export abstract class ApiContainer extends DefaultContainer {
  constructor (gracefully = true) {
    super('api', gracefully)

    void this.up()
      .then(() => { this.initialize() })
  }

  abstract populate (app: Express): void

  protected initialize (): void {
    this.populate(this.app)

    super.initialize()
  }
}

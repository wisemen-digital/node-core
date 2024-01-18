/* eslint-disable no-console */
import { type Express } from 'express'
import { DefaultContainer } from './default.js'

export abstract class ApiContainer extends DefaultContainer {
  constructor (gracefully = true, initialize = true) {
    super('api', gracefully, initialize)
  }

  abstract populate (app: Express): void

  protected async initialize (): Promise<void> {
    await super.initialize()

    this.populate(this.app)

  }
}

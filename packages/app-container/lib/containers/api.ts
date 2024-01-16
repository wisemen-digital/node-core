/* eslint-disable no-console */
import { type Express } from 'express'
import { DefaultContainer } from './default.js'

export abstract class ApiContainer extends DefaultContainer {
  constructor (gracefully = true) {
    super('api', gracefully)
  }

  abstract populate (app: Express): void

  protected async initialize (): Promise<void> {
    this.populate(this.app)

    super.initialize()
  }
}

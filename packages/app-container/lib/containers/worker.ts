/* eslint-disable no-console */
import { DefaultContainer } from './default.js'

export abstract class WorkerContainer extends DefaultContainer {
  constructor (gracefully = true, initialize = true) {
    super('worker', gracefully, initialize)
  }

  abstract run (): Promise<void>

  protected async initialize (): Promise<void> {
    await super.initialize()

    await this.run()
  }
}

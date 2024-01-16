/* eslint-disable no-console */
import { DefaultContainer } from './default.js'

export abstract class WorkerContainer extends DefaultContainer {
  constructor (gracefully = true) {
    super('worker', gracefully)
  }

  abstract run (): Promise<void>

  protected async initialize (): Promise<void> {
    super.initialize()

    await this.run()
  }
}

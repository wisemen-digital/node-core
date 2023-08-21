/* eslint-disable no-console */
import { DefaultContainer } from './default.js'

export abstract class WorkerContainer extends DefaultContainer {
  constructor (gracefully = true) {
    super('worker', gracefully)

    void this.up()
      .then(() => { this.initialize() })
      .then(() => { void this.run() })
  }

  abstract run (): Promise<void>
}

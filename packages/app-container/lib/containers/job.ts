/* eslint-disable no-console */

import { DefaultContainer } from './default.js'

export abstract class JobContainer extends DefaultContainer {
  constructor (gracefully = true) {
    super('job', gracefully)
  }

  abstract run (): Promise<void>

  protected async initialize (): Promise<void> {
    await super.initialize()

    await this.run()
    await this.destroy()
  }
}

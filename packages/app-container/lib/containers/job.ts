/* eslint-disable no-console */

import { DefaultContainer } from './default.js'

export abstract class JobContainer extends DefaultContainer {
  constructor (gracefully = true) {
    super('job', gracefully)

    void this.up()
      .then(() => { this.initialize() })
      .then(async () => { await this.run() })
      .then(async () => { await this.destroy() })
  }

  abstract run (): Promise<void>
}

import type { INestApplicationContext } from '@nestjs/common'
import { ProbedContainer } from './default.js'

export abstract class JobContainer extends ProbedContainer {
  abstract execute (nest: INestApplicationContext): Promise<void>

  protected async init (): Promise<void> {
    await super.init()

    await this.execute(this.nest!)

    await this.close()
  }
}

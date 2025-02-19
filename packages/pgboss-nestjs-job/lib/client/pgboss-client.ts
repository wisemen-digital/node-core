import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import PgBoss from 'pg-boss'

@Injectable()
export class PgBossClient extends PgBoss implements OnModuleInit, OnModuleDestroy {
  constructor () {
    super({
      connectionString: process.env.DATABASE_URI
    })
  }

  async onModuleInit (): Promise<void> {
    await this.start()
  }

  async onModuleDestroy (): Promise<void> {
    await this.stop()
  }
}

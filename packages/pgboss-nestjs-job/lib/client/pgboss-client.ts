import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import PgBoss from 'pg-boss'

export interface PgBossClientConfig {
  onClientError?: (error: Error) => Promise<void> | void
}

@Injectable()
export class PgBossClient extends PgBoss implements OnModuleInit, OnModuleDestroy {
  constructor (
    @Inject('PG_BOSS_CLIENT_CONFIG') private readonly config?: PgBossClientConfig
  ) {
    super({
      connectionString: process.env.DATABASE_URI
    })
  }

  async onModuleInit (): Promise<void> {
    await this.start()
    this.on('error', this.config?.onClientError ?? ((error: Error) => {process.exit('1')}))
  }

  async onModuleDestroy (): Promise<void> {
    await this.stop()
  }
}

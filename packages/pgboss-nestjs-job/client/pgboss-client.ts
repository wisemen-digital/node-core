import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import PgBoss from 'pg-boss'

@Injectable()
export class PgBossClient extends PgBoss implements OnModuleInit, OnModuleDestroy {
  constructor (configService: ConfigService) {
    super({
      connectionString: configService.getOrThrow<string>('DATABASE_URI')
    })
  }

  async onModuleInit (): Promise<void> {
    await this.start()
  }

  async onModuleDestroy (): Promise<void> {
    await this.stop()
  }
}

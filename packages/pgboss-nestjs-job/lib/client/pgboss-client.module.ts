import { DynamicModule, Module } from '@nestjs/common'
import { PgBossClient, PgBossClientConfig } from './pgboss-client.js'

@Module({})
export class PgBossClientModule {
  forRoot(config?: PgBossClientConfig): DynamicModule {
    return {
      module: PgBossClientModule,
      providers: [
        {
          provide: 'PG_BOSS_CLIENT_CONFIG',
          useValue: config
        },
        PgBossClient
      ],
      exports: [PgBossClient]
    }
  }
}

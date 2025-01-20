import { type DynamicModule, Module } from '@nestjs/common'
import { JobModule } from '../jobs/job.module.js'
import { PgBossClientModule } from '../client/pgboss-client.module.js'
import { PgBossWorker } from './pgboss-worker.js'
import { PgBossWorkerConfig } from './pgboss-worker.config.js'

@Module({})
export class PgBossWorkerModule {
  static forRoot (config: PgBossWorkerConfig): DynamicModule {
    return {
      module: PgBossWorkerModule,
      imports: [
        JobModule,
        PgBossClientModule
      ],
      providers: [
        {
          provide: 'PG_BOSS_WORKER_CONFIG',
          useValue: config
        },
        PgBossWorker
      ]
    }
  }
}

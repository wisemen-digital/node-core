import { Module } from '@nestjs/common'
import { PgBossClientModule } from '../client/pgboss-client.module.js'
import { PgBossScheduler } from './pgboss-scheduler.service.js'

@Module({
  imports: [
    PgBossClientModule.forRoot()
  ],
  providers: [
    PgBossScheduler
  ],
  exports: [
    PgBossScheduler
  ]
})
export class PgBossSchedulerModule {}

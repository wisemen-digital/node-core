import { Module } from '@nestjs/common'
import { PgBossClient } from './pgboss-client.js'

@Module({
  providers: [PgBossClient],
  exports: [PgBossClient]
})
export class PgBossClientModule {}

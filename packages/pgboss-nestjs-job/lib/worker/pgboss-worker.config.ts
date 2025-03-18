import { PgBossClientConfig } from '../client/pgboss-client.module.js'

export interface PgBossWorkerConfig {
  queueName: string
  concurrency?: number
  pollInterval?: number
  batchSize?: number
  fetchRefreshThreshold?: number
  client?: PgBossClientConfig
}

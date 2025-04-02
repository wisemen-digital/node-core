import { PgBossClientConfig } from "../client/pgboss-client.js"

export interface PgBossWorkerConfig {
  queueName: string
  concurrency?: number
  pollInterval?: number
  batchSize?: number
  fetchRefreshThreshold?: number
  client?: PgBossClientConfig
}

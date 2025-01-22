export interface PgBossWorkerConfig {
  queueName: string
  concurrency?: number
  pollInterval?: number
  batchSize?: number
  fetchRefreshThreshold?: number
}

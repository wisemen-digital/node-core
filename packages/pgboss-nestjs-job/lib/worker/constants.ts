import PgBoss from 'pg-boss'
import { JobSerialization } from '../jobs/job-serialization.type.js'

export const DUPLICATE_SINGLETON_ERROR_MESSAGE = 'duplicate key value violates unique constraint "job_singleton_queue"'

export type RawPgBossJob = PgBoss.Job<JobSerialization>

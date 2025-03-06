import PgBoss from 'pg-boss'
import { SerializedJob } from '../jobs/serialized-job.js'

export type RawPgBossJobData = Exclude<SerializedJob['data'], undefined>
export type RawPgBossJob = PgBoss.Job<RawPgBossJobData>

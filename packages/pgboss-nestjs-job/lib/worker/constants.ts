import PgBoss from 'pg-boss'
import { JobSerialization } from '../jobs/job-serialization.type.js'

export type RawPgBossJob = PgBoss.Job<JobSerialization>

import { BaseJob, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { DOC_PROCESSOR_QUEUE_NAME } from '../../types/queue-name.js'
import { GeneratePdfFromUrlData } from './generate-pdf-from-url.data.js'

@PgBossJob(DOC_PROCESSOR_QUEUE_NAME)
export class GeneratePdfFromUrlJob extends BaseJob<GeneratePdfFromUrlData> {}

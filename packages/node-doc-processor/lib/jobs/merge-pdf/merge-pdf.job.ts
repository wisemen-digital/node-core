import { BaseJobConfig, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { DOC_PROCESSOR_QUEUE_NAME } from '../../types/queue-name.js';
import { MergePdfData } from './merge-pdf.data.js';

@PgBossJob(DOC_PROCESSOR_QUEUE_NAME)
export class MergePdfJob extends BaseJobConfig<MergePdfData> {}

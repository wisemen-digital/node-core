import { BaseJob, BaseJobData } from './base-job.js'

export abstract class JobHandler<T extends BaseJob> {
  abstract run (data: T['data']): Promise<void> | void
}

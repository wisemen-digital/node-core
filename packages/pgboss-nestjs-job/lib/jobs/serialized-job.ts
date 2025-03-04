import { BaseJob } from './base-job.js'
import { JobInsert } from 'pg-boss'

export interface SerializedJob<T extends BaseJob = BaseJob> extends JobInsert<{
  className: string
  classData: T['data']
}> {}

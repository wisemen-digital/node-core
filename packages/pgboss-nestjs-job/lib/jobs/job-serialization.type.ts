import { BaseJobData } from './base-job.js'

export interface JobSerialization<T extends BaseJobData = never> {
  className: string
  classData: T
}

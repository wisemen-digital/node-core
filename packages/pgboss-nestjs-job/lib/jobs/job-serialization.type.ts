import { BaseJobData } from './job.abstract.js'

export interface JobSerialization<T extends BaseJobData = never> {
  className: string
  classData: T
}

import { JobInsert } from 'pg-boss'

export interface BaseJobData {
  [key: string]: unknown
}

type JobOptions = Omit<JobInsert, 'id' | 'name' | 'data' | 'singletonKey'>

export abstract class BaseJob<T extends BaseJobData = {}> {
  constructor (
    readonly data: T = {} as T,
    readonly options?: JobOptions
  ) {}

  uniqueBy? (data: T): string
}


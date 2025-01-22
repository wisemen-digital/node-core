import { JobInsert } from 'pg-boss'

export interface BaseJobData {
  [key: string]: unknown
}

export abstract class BaseJobConfig<T extends BaseJobData = never> {
  constructor (
    public readonly data?: T,
    public readonly options?: Omit<JobInsert, 'id' | 'name' | 'data' | 'singletonKey'>
  ) {}

  uniqueBy? (): string
}

export abstract class BaseJobHandler<T extends BaseJobData = never> {
  abstract run (...data: T extends never ? [] : [T]): Promise<void> | void
  static uniqueBy? (data?: BaseJobData): string
}

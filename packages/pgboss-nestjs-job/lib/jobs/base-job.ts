import { JobInsert } from 'pg-boss'

type Primitive =  string | number | boolean | null
type Serializable = {
  [key: string | number | symbol]: Serializable | Serializable[] | Primitive | Primitive[] 
}

export type BaseJobData = Serializable

type JobOptions = Omit<JobInsert, 'id' | 'name' | 'data'>

export abstract class BaseJob<T extends BaseJobData = {}> {
  constructor (
    readonly data: T = {} as T,
    readonly options?: JobOptions
  ) {}
}


import { JobInsert } from 'pg-boss'
import { WiseDate } from '../../../wise-date/dist/index.js'

type Primitive =  string | number | boolean | null
type Serializable = {[key: string | number | symbol]: Serializable | Serializable[] | Primitive }
export type BaseJobData = Serializable

type JobOptions = Omit<JobInsert, 'id' | 'name' | 'data' | 'singletonKey'>

export abstract class BaseJob<T extends BaseJobData = {}> {
  constructor (
    readonly data: T = {} as T,
    readonly options?: JobOptions
  ) {}

  uniqueBy? (data: T): string
}


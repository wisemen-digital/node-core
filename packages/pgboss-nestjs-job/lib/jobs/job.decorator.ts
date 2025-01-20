import { SetMetadata } from '@nestjs/common'
import { BaseJobConfig, BaseJobData } from './job.abstract.js'

export const PGBOSS_JOB_HANDLER = 'PGBOSS_JOB_HANDLER'
export const PGBOSS_QUEUE_NAME = 'PGBOSS_QUEUE_NAME'

type ConfigConstructor<S extends BaseJobData, T extends BaseJobConfig<S>>
  = new (...args: unknown[]) => T

export function PgBossJobHandler<S extends BaseJobData, T extends BaseJobConfig<S>> (
  config: ConfigConstructor<S, T>
): ClassDecorator {
  return (target) => {
    SetMetadata(PGBOSS_JOB_HANDLER, config.name)(target)
  }
}

export function PgBossJob (
  name: string
): ClassDecorator {
  return (target) => {
    SetMetadata(PGBOSS_QUEUE_NAME, name)(target)
    SetMetadata(PGBOSS_JOB_HANDLER, target.name)(target)
  }
}

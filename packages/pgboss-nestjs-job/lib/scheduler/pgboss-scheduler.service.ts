import { Injectable } from '@nestjs/common'
import { ConnectionOptions, JobInsert } from 'pg-boss'
import { EntityManager } from 'typeorm'
import { createTransactionManagerProxy, InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { Reflector } from '@nestjs/core'
import { PgBossClient } from '../client/pgboss-client.js'
import { BaseJobConfig, BaseJobData } from '../jobs/job.abstract.js'
import { PGBOSS_JOB_HANDLER, PGBOSS_QUEUE_NAME } from '../jobs/job.decorator.js'

@Injectable()
export class PgBossScheduler {
  private readonly manager: EntityManager

  constructor (
    private readonly boss: PgBossClient,
    private readonly reflector: Reflector,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    this.manager = createTransactionManagerProxy(entityManager)
  }

  async scheduleJob<S extends BaseJobData, T extends BaseJobConfig<S>>(
    handler: T
  ): Promise<void> {
    const queue = this.reflector.get<string>(PGBOSS_QUEUE_NAME, handler.constructor)
    const className = this.reflector.get<string>(PGBOSS_JOB_HANDLER, handler.constructor)

    const job: JobInsert<S> | JobInsert = {
      name: queue,
      data: {
        className,
        classData: handler.data
      },
      priority: handler.options?.priority,
      retryLimit: handler.options?.retryLimit,
      retryDelay: handler.options?.retryDelay,
      retryBackoff: handler.options?.retryBackoff,
      startAfter: handler.options?.startAfter,
      singletonKey: handler.uniqueBy?.(),
      singletonSeconds: handler.options?.singletonSeconds,
      expireInSeconds: handler.options?.expireInSeconds,
      keepUntil: handler.options?.keepUntil,
      deadLetter: handler.options?.deadLetter
    }

    await this.insertJobs([job])
  }

  async scheduleJobs<S extends BaseJobData, T extends BaseJobConfig<S>>(
    handlers: T[]
  ): Promise<void> {
    if (handlers.length === 0) return

    const jobs: JobInsert<S>[] | JobInsert[] = []

    for (const handler of handlers) {
      const queue = this.reflector.get<string>(PGBOSS_QUEUE_NAME, handler.constructor)
      const className = this.reflector.get<string>(PGBOSS_JOB_HANDLER, handler.constructor)

      const job: JobInsert<S> | JobInsert = {
        name: queue,
        data: {
          className,
          classData: handler.data
        },
        priority: handler.options?.priority,
        retryLimit: handler.options?.retryLimit,
        retryDelay: handler.options?.retryDelay,
        retryBackoff: handler.options?.retryBackoff,
        startAfter: handler.options?.startAfter,
        singletonKey: handler.uniqueBy?.(),
        singletonSeconds: handler.options?.singletonSeconds,
        expireInSeconds: handler.options?.expireInSeconds,
        keepUntil: handler.options?.keepUntil,
        deadLetter: handler.options?.deadLetter
      }

      jobs.push(job as JobInsert<S>)
    }

    await this.insertJobs(jobs)
  }

  private async insertJobs <T extends object> (
    jobs: JobInsert<T>[] | JobInsert[]
  ): Promise<void> {
    const manager = this.manager

    const options: ConnectionOptions = {
      db: {
        async executeSql (text, values) {
          const result = await manager.query<object[]>(text, values)

          return {
            rows: result,
            rowCount: result.length
          }
        }
      }
    }

    await this.boss.insert(jobs, options)
  }
}

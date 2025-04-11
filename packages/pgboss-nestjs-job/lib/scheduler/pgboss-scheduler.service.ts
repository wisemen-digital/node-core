import { Injectable } from '@nestjs/common'
import { ConnectionOptions } from 'pg-boss'
import { EntityManager } from 'typeorm'
import { createTransactionManagerProxy, InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { Reflector } from '@nestjs/core'
import { PgBossClient } from '../client/pgboss-client.js'
import { BaseJob } from '../jobs/base-job.js'
import { PGBOSS_JOB_HANDLER, PGBOSS_QUEUE_NAME } from '../jobs/job.decorator.js'
import { SerializedJob } from '../jobs/serialized-job.js'
import { randomUUID } from 'crypto'


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

  async scheduleJob<T extends BaseJob>(job: T): Promise<void> {
    await this.scheduleJobs([job])
  }

  async scheduleJobs<T extends BaseJob>(jobs: T[]): Promise<void> {
    const serializedJobs = jobs.map(job => this.serializeJob(job))
    await this.insertJobs(serializedJobs)
  }

  private serializeJob<T extends BaseJob>(job: T): SerializedJob<T> {
    const queue = this.reflector.get<string>(PGBOSS_QUEUE_NAME, job.constructor)
    const className = this.reflector.get<string>(PGBOSS_JOB_HANDLER, job.constructor)

    return {
      name: queue,
      data: {
        className,
        classData: job.data
      },
      priority: job.options?.priority,
      retryLimit: job.options?.retryLimit,
      retryDelay: job.options?.retryDelay,
      retryBackoff: job.options?.retryBackoff,
      startAfter: job.options?.startAfter,
      singletonKey: job.options?.singletonKey ?? randomUUID(),
      singletonSeconds: job.options?.singletonSeconds,
      expireInSeconds: job.options?.expireInSeconds,
      keepUntil: job.options?.keepUntil,
      deadLetter: job.options?.deadLetter,
    }
  }

  private async insertJobs <T extends BaseJob> (jobs: SerializedJob<T>[]): Promise<void> {
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

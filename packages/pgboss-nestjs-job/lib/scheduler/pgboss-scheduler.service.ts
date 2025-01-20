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
      singletonKey: handler.uniqueBy?.()
    }

    await this.scheduleJobs([job])
  }

  private async scheduleJobs <T extends object> (
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

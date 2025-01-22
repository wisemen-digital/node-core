import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { captureError } from 'rxjs/internal/util/errorContext'
import { JobSerialization } from '../jobs/job-serialization.type.js'
import { PgBossClient } from '../client/pgboss-client.js'
import { JobRegistry } from '../jobs/job.registry.js'
import { PgBossWorkerConfig } from './pgboss-worker.config.js'
import { PgBossWorkerThread } from './pgboss-worker.thread.js'
import { RawPgBossJob } from './constants.js'

@Injectable()
export class PgBossWorker implements OnModuleInit, OnModuleDestroy {
  private readonly queueName: string
  private readonly jobs: RawPgBossJob[] = []
  private readonly threads: Array<Promise<void>> = []
  private jobFetchingPromise: Promise<void> | null = null
  private working = false
  private readonly concurrency: number
  private readonly pollInterval: number
  private readonly batchSize: number
  private readonly fetchRefreshThreshold: number

  constructor (
    @Inject('PG_BOSS_WORKER_CONFIG') config: PgBossWorkerConfig,
    private readonly client: PgBossClient,
    private readonly jobRegistry: JobRegistry
  ) {
    this.queueName = config.queueName
    this.concurrency = config?.concurrency ?? 1
    this.pollInterval = config?.pollInterval ?? 2000
    this.batchSize = config?.batchSize ?? this.concurrency
    this.fetchRefreshThreshold = config?.fetchRefreshThreshold ?? 0
  }

  onModuleInit (): void {
    if (this.working) {
      return
    }

    this.working = true

    const jobGenerator = this.createJobGenerator()

    this.startWorkerThreads(jobGenerator)
  }

  async onModuleDestroy (): Promise<void> {
    await this.stop()
  }

  private startWorkerThreads (jobGenerator: AsyncGenerator<RawPgBossJob, void, unknown>) {
    for (let i = 0; i < this.concurrency; i++) {
      const thread = new PgBossWorkerThread(jobGenerator, this.client, this.jobRegistry)

      this.threads.push(thread.run())
    }
  }

  private async * createJobGenerator (): AsyncGenerator<RawPgBossJob, void, unknown> {
    while (this.working || this.jobs.length > 0) {
      const job = this.jobs.shift()

      if (job != null) {
        yield job
      } else {
        await this.fetchJobs()
      }

      if (this.jobs.length < this.fetchRefreshThreshold) {
        void this.fetchJobs().catch(captureError)
      }
    }
  }

  private async fetchJobs (): Promise<void> {
    if (!this.working) {
      return
    }

    if (this.jobFetchingPromise != null) {
      await this.jobFetchingPromise

      return
    }

    this.jobFetchingPromise = new Promise((resolve, reject) => {
      void this.client.fetch<JobSerialization>(
        this.queueName,
        { batchSize: this.batchSize }
      )
        .then(async (jobs) => {
          if (jobs == null || jobs.length === 0) {
            await new Promise(resolve => setTimeout(resolve, this.pollInterval))
          } else {
            this.jobs.push(...jobs)
          }

          resolve()
        })
        .catch((e) => {
          reject(e as Error)
        })
    })

    await this.jobFetchingPromise

    this.jobFetchingPromise = null
  }

  public async stop (): Promise<void> {
    this.working = false

    await Promise.allSettled(this.threads)
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { DiscoveryService, Reflector } from '@nestjs/core'
import { PGBOSS_JOB_HANDLER } from './job.decorator.js'
import { BaseJobData, BaseJobHandler } from './job.abstract.js'

@Injectable()
export class JobRegistry implements OnModuleInit {
  private readonly logger = new Logger(JobRegistry.name)
  private handlers = new Map<string, BaseJobHandler>()

  constructor (
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector
  ) {}

  onModuleInit () {
    const providers = this.discoveryService.getProviders()

    for (const wrapper of providers) {
      const { instance } = wrapper

      if (instance == null) continue

      const jobName = this.reflector.get<string>(PGBOSS_JOB_HANDLER, instance.constructor)
      // const queueName = this.reflector.get<string>(PGBOSS_QUEUE_NAME, instance.constructor)

      if (jobName) {
        if (!(instance.run instanceof Function)) {
          throw new Error(`JobHandler ${instance.constructor.name} does not implement run()`)
        }

        this.logger.log(`Registering job handler: ${jobName}`)
        this.handlers.set(jobName, instance as BaseJobHandler)
      }
    }
  }

  get (jobName: string): BaseJobHandler<BaseJobData> {
    const handler = this.handlers.get(jobName)

    if (!handler) {
      throw new Error(`No job handler found for job: ${jobName}`)
    }

    return handler
  }
}

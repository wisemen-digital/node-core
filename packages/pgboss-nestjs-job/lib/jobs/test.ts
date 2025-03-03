import { BaseJob, BaseJobData } from './base-job.js'
import { JobHandler } from './job-handler.js'

interface JobData extends BaseJobData{
  foobar: string
}

class JobDataTest extends BaseJob<JobData> {
  constructor(foobar: string) {
    super({foobar}, {expireInSeconds: 124})
  }


  uniqueBy(data: JobData): string {
    return data.foobar
  }
}

class JobDataTestHandler extends JobHandler<JobDataTest> {
    run(data: JobData): Promise<void> | void {
        throw new Error('Method not implemented.')
    }
}

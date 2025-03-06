import { BaseJobData } from '@wisemen/pgboss-nestjs-job'

export interface MergePdfData extends BaseJobData {
  inputFiles: Array<{
    s3Path: string
    pages?: number[]
  }>
  outputS3Path: string
}

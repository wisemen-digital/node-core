import { BaseJobData } from '@wisemen/pgboss-nestjs-job'
import { PageFormatEnum } from '../../types/enums/page-format.enum.js'
import { PageOrientationEnum } from '../../types/enums/page-orientation.enum.js'

export interface GeneratePdfFromUrlData extends BaseJobData {
  url: string
  s3Path: string

  orientation?: PageOrientationEnum
  format?: PageFormatEnum
}

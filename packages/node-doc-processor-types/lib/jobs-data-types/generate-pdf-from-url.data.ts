import { PageFormat } from "../enums/page-format.enum.js"
import { PageOrientation } from "../enums/page-orientation.enum.js"

export interface GeneratePdfFromUrlData {
  url: string
  s3Path: string

  orientation?: PageOrientation
  format?: PageFormat
}

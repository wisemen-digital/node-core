export interface MergePdfData {
  inputFiles: Array<{
    s3Path: string
    pages?: number[]
  }>
  outputS3Path: string
}

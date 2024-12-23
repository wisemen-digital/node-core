export interface ErrorContent {
  code: string
  detail: string
  title?: string
  id?: string
  status?: number
  source?: { pointer: string }
  meta?: unknown
}

export interface ErrorResponse {
  errors: ErrorContent[]
}

export interface ErrorList {
  [key: string]: {
    status: number
    detail: string
  }
}

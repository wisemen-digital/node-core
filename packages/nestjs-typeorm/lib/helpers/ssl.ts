import { TlsOptions } from 'tls'

export function sslHelper (type?: string): boolean | TlsOptions {
  if (type === 'ignore') return { rejectUnauthorized: false }
  if (type === 'false') return false
  if (type === 'true') return true

  return false
}

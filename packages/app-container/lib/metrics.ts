import { Registry, collectDefaultMetrics } from 'prom-client'

export const register = new Registry()

collectDefaultMetrics({ register })

export * from 'prom-client'

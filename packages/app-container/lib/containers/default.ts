/* eslint-disable no-console */

import { type Server, type ServerResponse } from 'http'
import express, { type Express } from 'express'
import { register } from '../metrics.js'
import EventEmitter from 'events'

export declare interface DefaultContainer {
  on: (event: 'mounted', listener: (server: Server) => void) => this
}

export abstract class DefaultContainer extends EventEmitter {
  public readonly app: Express = express()
  protected server?: Server
  private state: 'starting' | 'ready' | 'shutdown' | 'unknown'

  constructor (type: 'job' | 'worker' | 'api', gracefully = true) {
    super()

    console.log(`starting ${type}`)

    this.state = 'starting'

    if (gracefully) {
      process.on('SIGTERM', () => { void this.destroy() })
      process.on('SIGINT', () => { void this.destroy() })
      process.on('SIGUSR2', () => { void this.destroy() })
      process.on('SIGHUP', () => { void this.destroy() })
    }
  }

  abstract up (): Promise<void>
  abstract down (): Promise<void>

  protected initialize (): void {
    this.app.get('/', (_, res) => { this.version(res) })
    this.app.get('/health', (_, res) => { this.liveness(res) })
    this.app.get('/ready', (_, res) => { this.readiness(res) })
    this.app.get('/metrics', (_, res) => { this.metrics(res) })

    this.server = this.app.listen(process.env.PORT ?? 3000, () => {
      console.log('server started')

      this.state = 'ready'
    })

    this.emit('mounted', this.server)
  }

  protected async destroy (): Promise<void> {
    console.log('shutting down server')

    this.state = 'shutdown'

    if (this.server == null) {
      await this.down()
    } else {
      this.server?.close(() => {
        void this.down().finally(() => {
          console.log('server shutdown')
        })
      })
    }
  }

  private liveness (res: ServerResponse): void {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write('OK')
    res.end()
  }

  private readiness (res: ServerResponse): void {
    if (this.state === 'ready') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.write('OK')
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.write('not OK')
    }

    res.end()
  }

  private metrics (res: ServerResponse): void {
    if (this.state !== 'ready') {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.write('not OK')
      return
    }

    register.metrics()
      .then(string => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write(string)
      })
      .catch((e) => {
        console.log(e)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.write(e)
      })
      .finally(() => {
        res.end()
      })
  }

  private version (res: ServerResponse): void {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify({
      env: process.env.NODE_ENV,
      commit: process.env.COMMIT,
      build: process.env.BUILD_NUMBER,
      version: process.env.VERSION
    }))
    res.end()
  }
}

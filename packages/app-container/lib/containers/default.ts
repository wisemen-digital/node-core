import type { Server, ServerResponse } from 'http'
import express, { type Express } from 'express'
import type { INestApplicationContext } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'

const port = process.env.PORT ?? 3000

type State = 'starting' | 'ready' | 'shutdown' | 'unknown'

export interface ProbedContainer {
  execute? (nest: INestApplicationContext): Promise<void>
}

export abstract class ProbedContainer {
  private readonly app: Express
  private readonly server: Server
  private state: State

  protected nest?: INestApplicationContext

  abstract bootstrap (app: ExpressAdapter): Promise<INestApplicationContext>

  constructor () {
    this.state = 'starting'

    this.app = express()
    this.server = this.app.listen(port, () => {
      console.log('server started')
    })

    this.enableShutdownHooks()
    this.enableProbes()

    void this.init()

    // initSentry()
  }

  protected async init (): Promise<void> {
    try {
      const adapter = new ExpressAdapter(this.app)

      this.nest = await this.bootstrap(adapter)

      await this.nest.init()

      this.state = 'ready'

      if (this.execute != null) {
        await this.execute(this.nest)

        await this.close()
      }
    } catch {
      await this.close()
    }
  }

  protected async close (): Promise<void> {
    if (this.state === 'shutdown') {
      return
    }

    this.state = 'shutdown'

    try {
      await new Promise<void>((resolve, reject) => {
        this.server.close((err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      await this.nest?.close()

      console.log('application closed')
    } catch (e) {
      console.error('error shutting down', e)

      process.exit(1)
    }
  }

  private enableShutdownHooks (): void {
    process.on('SIGTERM', () => void this.close())
    process.on('SIGINT', () => void this.close())
    process.on('SIGUSR2', () => void this.close())
    process.on('SIGHUP', () => void this.close())
  }

  private enableProbes (): void {
    this.app.get('/', (_, res) => {
      this.version(res)
    })
    this.app.get('/health', (_, res) => {
      this.liveness(res)
    })
    this.app.get('/ready', (_, res) => {
      this.readiness(res)
    })
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

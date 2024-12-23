import { NestFactory } from '@nestjs/core'
import { Module, type INestApplicationContext } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApiContainer } from '../lib/containers/api.js'

@Module({})
export class AppModule {}

class Api extends ApiContainer {
  async bootstrap (express: ExpressAdapter): Promise<INestApplicationContext> {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(express)
    )

    app.setGlobalPrefix('api')
    app.enableCors()

    return app
  }
}

const _api = new Api()

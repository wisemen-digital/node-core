import type { NextFunction, Request, Response } from 'express'
import { Dto } from './dto.js'

export type Constructor<T> = T extends undefined ? undefined : new () => T

export type MiddlewareHandler = (req: Request, res: Response, next: NextFunction) => void
interface ControllerMetaOptions {
  query?: Dto | undefined
  body?: Dto | undefined
}

export interface ControllerOptions <
  Options extends ControllerMetaOptions = { query: undefined, body: undefined }
> {
  req: Request
  query: Options['query']
  body: Options['body']
  }

export interface RouteOptions <BodyDto extends Dto | undefined, QueryDto extends Dto | undefined>  {
  path: string
  middleware?: MiddlewareHandler[]
  controller: (options: ControllerOptions<{ body: BodyDto, query: QueryDto }>) => Promise<unknown>
  dtos?: {
    groups?: string[]
    query?: Constructor<QueryDto>
    body?: Constructor<BodyDto>
  }
}

export interface HandleOptions <BodyDto extends Dto | undefined, QueryDto extends Dto | undefined> {
  req: Request
  res: Response
  controller: (options: ControllerOptions<{ body?: BodyDto, query?: QueryDto }>) => Promise<unknown>
  dtos?: {
    groups?: string[]
    query?: Constructor<QueryDto>
    body?: Constructor<BodyDto>
  }
}

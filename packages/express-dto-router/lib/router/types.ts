import type { NextFunction, Request, Response } from 'express'
import { Dto } from './dto.js'
import { ClassConstructor } from 'class-transformer'

export type MiddlewareHandler = (req: Request, res: Response, next: NextFunction) => void
interface ControllerMetaOptions {
  query?: Dto | undefined
  body?: Dto | undefined
}

export interface ControllerOptions <
  Options extends ControllerMetaOptions = {}
> {
  req: Request
  query: Options['query']
  body: Options['body']
  }

export interface RouteOptions <BodyDto extends Dto, QueryDto extends Dto>  {
  path: string
  middleware?: MiddlewareHandler[]
  controller: (options: ControllerOptions<{ body: BodyDto, query: QueryDto }>) => Promise<unknown>
  dtos?: {
    groups?: string[]
    query?: ClassConstructor<QueryDto>
    body?: ClassConstructor<BodyDto>
  }
}

export interface HandleOptions <BodyDto extends Dto, QueryDto extends Dto> {
  req: Request
  res: Response
  controller: (options: ControllerOptions<{ body?: BodyDto, query?: QueryDto }>) => Promise<unknown>
  dtos?: {
    groups?: string[]
    query?: ClassConstructor<QueryDto> | undefined
    body?: ClassConstructor<BodyDto> | undefined
  }
}

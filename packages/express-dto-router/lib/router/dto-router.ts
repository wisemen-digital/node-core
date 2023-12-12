import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express'
import { CustomError } from '../errors/custom-error.js'
import { validateUuid } from '../middleware/validate-uuid.middleware.js'
import { ApiResponse } from './api-response.js'
import { Dto, validateDto } from './dto.js'
import { HandleOptions, MiddlewareHandler, RouteOptions } from './types.js'
import { captureException } from '@sentry/node'


export class DtoRouter {
  readonly router: Router = Router({ mergeParams: true })

  static mapError (error: Error, req: Request, res: Response): Error {
    return error
  }

  static async handleError (err: Error, req: Request, res: Response): Promise<void> {
    const error = this.mapError(err, req, res)

    if (error instanceof CustomError) {
      res.status(error.status ?? 400).json(error.response)
    } else {
      error['transaction_id'] = captureException(error)

      const status = error['status'] ?? 500

      res.status(status).json({
        errors: [{
          id: error['transaction_id'],
          code: error.name,
          detail: error.message
        }]
      })

      return Promise.reject(error)
    }
  }

  private async handle <BodyDto extends Dto, QueryDto extends Dto> (options: HandleOptions<BodyDto, QueryDto>): Promise<void> {
    const { req, res, dtos } = options

    const body = await validateDto(req.body, dtos?.body, dtos?.groups)
    const query = await validateDto(req.query, dtos?.query, dtos?.groups)

    const result = await options.controller({
      req,
      body,
      query
    })

    if (result instanceof ApiResponse) {
      await result.execute(res)
    } else {
      res.json(result)
    }
  }

  get <BodyDto extends Dto, QueryDto extends Dto> (options: RouteOptions<BodyDto, QueryDto>): void {
    const { path, middleware, ...handleOptions } = options

    this.router.get(path, ...middleware ?? [], (req: Request, res: Response, next: NextFunction) => {
      this.handle({
        req,
        res,
        ...handleOptions
      }).catch(err => next(err))
    })
  }

  post <BodyDto extends Dto, QueryDto extends Dto> (options: RouteOptions<BodyDto, QueryDto>): void {
    const { path, middleware, ...handleOptions } = options

    this.router.post(path, ...middleware ?? [], (req: Request, res: Response, next: NextFunction) => {
      this.handle({
        req,
        res,
        ...handleOptions
      }).catch(err => next(err))
    })
  }

  delete <BodyDto extends Dto, QueryDto extends Dto> (options: RouteOptions<BodyDto, QueryDto>): void {
    const { path, middleware, ...handleOptions } = options

    this.router.delete(path, ...middleware ?? [], (req: Request, res: Response, next: NextFunction) => {
      this.handle({
        req,
        res,
        ...handleOptions
      }).catch(err => next(err))
    })
  }

  use (...handlers: MiddlewareHandler[]|[string, ...Array<RequestHandler|RequestHandler[]>]|[string, ...MiddlewareHandler[]]): void {
    const [path, ...middleware] = handlers as [string, ...MiddlewareHandler[]]

    this.router.use(path, ...middleware)
  }

  param (name: string, handler: RequestParamHandler): void {
    this.router.param(name, (req, res, next, param, name) => {
      handler(req, res, next, param, name)
        ?.catch?.(error => next(error))
    })
  }

  uuidParam(name: string): void {
    this.param(name, validateUuid)
  }
}

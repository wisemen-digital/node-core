import { NextFunction, Request, Response } from 'express'
import { DtoRouter } from './dto-router.js'

export function DtoErrorHandler () {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
      DtoRouter.handleError(error, req, res)
        .catch(err => next(err))
    } else {
      next(error)
    }
  }
}

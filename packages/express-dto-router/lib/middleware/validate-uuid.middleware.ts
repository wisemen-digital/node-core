import { RequestParamHandler, Request, Response, NextFunction } from "express";
import { isUUID } from "class-validator";
import { CustomError } from '../errors/custom-error.js';

export const validateUuid: RequestParamHandler = function (
    _req: Request,
    _res: Response,
    next: NextFunction,
    param: string,
    _name: string
) {
    if(isUUID(param)) {
        next()
    } else {
        next(new CustomError('invalid_uuid').setDesc('Invalid uuid in path!'))
    }
}

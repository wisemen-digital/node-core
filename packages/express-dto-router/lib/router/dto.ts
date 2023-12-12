/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from 'class-validator'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { CustomError } from '../errors/custom-error.js'

export abstract class Dto {}

export async function validateDto <T extends Dto> (
  data: unknown,
  DtoConstructor?: ClassConstructor<T> | undefined,
  groups?: string[]
): Promise<T|undefined> {
  if (DtoConstructor == null) {
    return undefined
  }

  const dto = plainToInstance(DtoConstructor, data)

  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
    always: true,
    strictGroups: false,
    groups
   })


   if (errors.length > 0) {
    throw new CustomError(errors)
  }

  return dto
}

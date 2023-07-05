/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { CustomError } from '../errors/custom-error.js'

export abstract class Dto {
  async validate (data: unknown, groups?: string[]): Promise<this> {
    const dto = plainToInstance(this.constructor as unknown as any, data)

    Object.assign(this, dto)

    const errors = await validate(this, {
      whitelist: true,
      forbidNonWhitelisted: true,
      always: true,
      strictGroups: false,
      groups
     })

    if (errors.length > 0) {
      throw new CustomError(errors)
    }

    return this
  }
}

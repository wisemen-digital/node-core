import { type ValidationOptions, ValidateBy, buildMessage, isUUID } from 'class-validator'
import type { BaseEntity } from 'typeorm'

export function IsEntity <T extends BaseEntity & { uuid: string }> (
  Entity: (new () => T) & typeof BaseEntity,
  // where: (value) => FindOptionsWhere<T> = value => ({ uuid: value }),
  withDeleted = false,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy({
    name: 'isEntity',
    validator: {
      validate: async (value): Promise<boolean> => {
        if (validationOptions?.each === true) {
          if (!Array.isArray(value)) return false
          for (const v of value) {
            if (!isUUID(v)) return false
            if (await Entity.count<T>({ where: { uuid: v }, withDeleted }) === 0) return false
          }
          return true
        }
        if (!isUUID(value)) return false
        return await Entity.count<T>({ where: { uuid: value }, withDeleted }) > 0
      },
      defaultMessage: buildMessage(eachPrefix => eachPrefix + `$property must be an existing ${Entity.name}`, validationOptions)
    }
  })
}

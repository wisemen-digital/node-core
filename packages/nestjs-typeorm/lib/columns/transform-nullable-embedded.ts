import { AfterLoad, AfterInsert, AfterUpdate } from 'typeorm'

export function TransformNullableEmbedded (): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const transform = function (this: Function) {
      if (this[propertyKey] === null) {
        return
      }

      this[propertyKey] = transformNullableEmbedded<unknown>(this[propertyKey])
    }

    const transformMethodName = `__transform_${propertyKey.toString()}`

    target[transformMethodName] = transform

    const afterLoadDecorator = AfterLoad()

    afterLoadDecorator(target, transformMethodName)

    const afterInsertDecorator = AfterInsert()

    afterInsertDecorator(target, transformMethodName)

    const afterUpdateDecorator = AfterUpdate()

    afterUpdateDecorator(target, transformMethodName)
  }
}

function transformNullableEmbedded<T> (obj: T): T | null {
  for (const key in obj) {
    if (obj[key] != null) {
      return obj
    }
  }

  return null
}

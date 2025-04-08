import { applyDecorators } from '@nestjs/common'
import { Column } from 'typeorm'
import { ColumnEmbeddedOptions } from 'typeorm/decorator/options/ColumnEmbeddedOptions.js'
import { TransformNullableEmbedded } from './transform-nullable-embedded.js'

export interface EmbeddedColumnOptions extends ColumnEmbeddedOptions {
  nullable?: boolean
}

export function EmbeddedColumn (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  embeddedClass: Function,
  options?: EmbeddedColumnOptions
): PropertyDecorator {
  const { nullable = false, ...otherOptions } = options ?? {}

  if (nullable === true) {
    return Column(() => embeddedClass, otherOptions)
  } else {
    return applyDecorators(
      Column(() => embeddedClass, otherOptions),
      TransformNullableEmbedded()
    )
  }
}

import { applyDecorators } from '@nestjs/common'
import { Coordinates } from '@wisemen/coordinates'
import { Column, ColumnOptions, Point } from 'typeorm'

export type CoordinatesColumnOptions = Omit<ColumnOptions, 'type' | 'transformer' | 'spatialFeatureType' | 'srid'>

export function CoordinatesColumn (options?: CoordinatesColumnOptions): PropertyDecorator {
  return applyDecorators(
    Column({
      ...options,
      type: 'geometry',
      spatialFeatureType: 'Point',
      srid: 4326,
      transformer: CoordinatesTransformer.getInstance()
    })
  )
}

class CoordinatesTransformer {
  private static instance: CoordinatesTransformer | undefined

  public static getInstance (): CoordinatesTransformer {
    if (CoordinatesTransformer.instance === undefined) {
      CoordinatesTransformer.instance = new CoordinatesTransformer()
    }

    return CoordinatesTransformer.instance
  }

  from (value: Point | null): Coordinates | null {
    if (value === null) {
      return null
    } else {
      return new Coordinates(value)
    }
  }

  to (value: Coordinates | null): Point | null {
    return value?.toPoint() ?? null
  }
}

import { isLatLong, isObject } from 'class-validator'
import { Point } from 'typeorm'

export class Coordinates {
  public readonly latitude: number
  public readonly longitude: number

  constructor (point: Point)
  constructor (latitude: number, longitude: number)
  constructor (pointOrLatitude: Point | number, longitude?: number) {
    let latitude: number
    if (isObject(pointOrLatitude)) {
      latitude = pointOrLatitude.coordinates[1]
      longitude = pointOrLatitude.coordinates[0]
    } else {
      latitude = pointOrLatitude
      longitude = longitude as number
    }

    if (!isLatLong(`${latitude},${longitude}`)) {
      throw new Error(`${latitude},${longitude} are not valid coordinates`)
    }

    this.latitude = latitude
    this.longitude = longitude
  }

  toPoint (): Point {
    return {
      type: 'Point',
      coordinates: [this.longitude, this.latitude]
    }
  }

  equals (other: Coordinates): boolean {
    return this.latitude === other.latitude && this.longitude === other.longitude
  }
}

import { ApiProperty } from '@nestjs/swagger'
import { Coordinates } from './coordinates.js'

export class CoordinatesResponse {
  @ApiProperty({ type: Number })
  longitude: number

  @ApiProperty({ type: Number })
  latitude: number

  constructor (coordinates: Coordinates) {
    this.longitude = coordinates.longitude
    this.latitude = coordinates.latitude
  }
}

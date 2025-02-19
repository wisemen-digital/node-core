import { ApiProperty } from '@nestjs/swagger'
import { IsLatitude, IsLongitude, IsNumber } from 'class-validator'
import { Coordinates } from './coordinates.js'

export class CoordinatesCommand {
  @ApiProperty({
    type: Number,
    example: 5.420593668305642
  })
  @IsNumber()
  @IsLongitude()
  longitude: number

  @ApiProperty({
    type: Number,
    example: 50.894565509367055
  })
  @IsNumber()
  @IsLatitude()
  latitude: number

  toCoordinates (): Coordinates {
    return new Coordinates(this.latitude, this.longitude)
  }
}

import { CoordinatesCommand } from './coordinates.command.js'

export class CoordinatesCommandBuilder {
  private point: CoordinatesCommand

  constructor () {
    this.point = new CoordinatesCommand()
    this.point.latitude = 50.894565509367055
    this.point.longitude = 5.420593668305642
  }

  withLatitude (lat: number): CoordinatesCommandBuilder {
    this.point.latitude = lat

    return this
  }

  withLongitude (long: number): CoordinatesCommandBuilder {
    this.point.longitude = long

    return this
  }

  build (): CoordinatesCommand {
    return this.point
  }
}

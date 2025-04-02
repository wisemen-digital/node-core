import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Point } from 'typeorm'
import { Coordinates } from '../coordinates.js'

describe('Coordinates', () => {
  it('throws an error when -Infinity latitude is provided to the constructor', () => {
    expect(() => new Coordinates(-Infinity, 0)).toThrow()
  })

  it('throws an error when NaN latitude is provided to the constructor', () => {
    expect(() => new Coordinates(NaN, 0)).toThrow()
  })

  it('throws an error when less than 90 latitude is provided to the constructor', () => {
    expect(() => new Coordinates(-90.1, 0)).toThrow()
  })

  it('throws an error when more than 90 latitude is provided to the constructor', () => {
    expect(() => new Coordinates(90.1, 0)).toThrow()
  })

  it('throws an error when Infinity latitude is provided to the constructor', () => {
    expect(() => new Coordinates(Infinity, 0)).toThrow()
  })

  it('Creates a new Coordinates instance with the maximum latitude', () => {
    expect(() => new Coordinates(90, 0)).not.toThrow()
  })

  it('Creates a new Coordinates instance with the minimum latitude', () => {
    expect(() => new Coordinates(-90, 0)).not.toThrow()
  })

  it('Creates a new Coordinates instance with valid coordinates', () => {
    expect(() => new Coordinates(0, 0)).not.toThrow()
  })

  it('throws an error when -Infinity longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, -Infinity)).toThrow()
  })

  it('throws an error when NaN longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, NaN)).toThrow()
  })

  it('throws an error when less than 180 longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, -180.1)).toThrow()
  })

  it('throws an error when more than 180 longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, 180.1)).toThrow()
  })

  it('throws an error when Infinity longitude is provided to the constructor', () => {
    expect(() => new Coordinates(0, Infinity)).toThrow()
  })

  it('Creates a new Coordinates instance with the maximum longitude', () => {
    expect(() => new Coordinates(0, 180)).not.toThrow()
  })

  it('Creates a new Coordinates instance with the minimum longitude', () => {
    expect(() => new Coordinates(0, -180)).not.toThrow()
  })

  it('Maps Coordinates to a GeoJSON point', () => {
    const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)
    const point = coordinates.toPoint()
    expect(point).toStrictEqual({
      type: 'Point',
      coordinates: [5.420593668305642, 50.894565509367055]
    })
  })

  it('Creates coordinates from a GeoJSON point', () => {
    const point: Point = {
      type: 'Point',
      coordinates: [5.420593668305642, 50.894565509367055]
    }

    const coordinates = new Coordinates(point)
    expect(coordinates.latitude).toBe(50.894565509367055)
    expect(coordinates.longitude).toBe(5.420593668305642)
  })

  it('Returns true when comparing the same locations', () => {
    const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)
    const otherCoordinates = new Coordinates(50.894565509367055, 5.420593668305642)
    expect(coordinates.equals(otherCoordinates)).toBe(true)
  })

  it('Returns true when comparing to self', () => {
    const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)
    expect(coordinates.equals(coordinates)).toBe(true)
  })

  it('Returns false when comparing to other coordinates', () => {
    const coordinates = new Coordinates(50.894565509367055, 5.420593668305642)
    const otherCoordinates = new Coordinates(50, 5)
    expect(coordinates.equals(otherCoordinates)).toBe(false)
  })
})

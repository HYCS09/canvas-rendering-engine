import { ShapeType } from '@/enums'
import { Shape } from './Shape'
import { Point } from '../Point'

export class Ellipse extends Shape {
  public x: number
  public y: number
  public radiusX: number
  public radiusY: number
  public readonly type = ShapeType.Ellipse
  constructor(x = 0, y = 0, radiusX = 0, radiusY = 0) {
    super()
    this.x = x
    this.y = y
    this.radiusX = radiusX
    this.radiusY = radiusY
  }
  public contains(point: Point): boolean {
    return true
  }
}

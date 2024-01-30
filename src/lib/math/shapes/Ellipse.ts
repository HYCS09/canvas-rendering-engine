import { ShapeType } from '@/enums'
import { Shape } from './Shape'
import { Point } from '../Point'

export class Ellipse extends Shape {
  public x: number
  public y: number
  public radiusX: number
  public radiusY: number
  public readonly type = ShapeType.Ellipse
  constructor(x = 1, y = 1, radiusX = 1, radiusY = 1) {
    super()
    this.x = x
    this.y = y
    this.radiusX = radiusX
    this.radiusY = radiusY
  }
  public contains(p: Point): boolean {
    if (
      ((p.x - this.x) * (p.x - this.x)) / (this.radiusX * this.radiusX) +
        ((p.y - this.y) * (p.y - this.y)) / (this.radiusY * this.radiusY) <
      1
    ) {
      return true
    } else {
      return false
    }
  }
}

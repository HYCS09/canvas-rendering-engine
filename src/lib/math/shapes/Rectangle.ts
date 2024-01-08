import { ShapeType } from '@/enums'
import { Shape } from './Shape'
import { Point } from '@/math'

export class Rectangle extends Shape {
  public x: number
  public y: number
  public width: number
  public height: number
  public type = ShapeType.Rectangle
  constructor(x = 0, y = 0, width = 0, height = 0) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  public contains(point: Point): boolean {
    return true
  }
}

import { ShapeType } from '@/enums'
import { Shape } from './Shape'
import { Point } from '@/math'

export class Polygon extends Shape {
  public points: number[] // 多边形由多个点构成，points数组每2个元素代表一个点的坐标
  public closeStroke = false
  public readonly type = ShapeType.Polygon
  constructor(points: number[] = []) {
    super()
    this.points = points
  }
  public contains(point: Point): boolean {
    return true
  }
}

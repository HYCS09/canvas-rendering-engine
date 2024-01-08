import { Shape } from '@/math/shapes/Shape'
import { FillStyle } from './style/FillStyle'
import { LineStyle } from './style/LineStyle'

export class GraphicsData {
  public shape: Shape
  public lineStyle: LineStyle
  public fillStyle: FillStyle
  public points: number[] = [] // 每2个元素代表一个点的坐标
  constructor(shape: Shape, fillStyle: FillStyle, lineStyle: LineStyle) {
    this.shape = shape
    this.lineStyle = lineStyle
    this.fillStyle = fillStyle
  }
}

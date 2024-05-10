import { Shape } from '@/math'
import { FillStyle } from './style/FillStyle'
import { LineStyle } from './style/LineStyle'

export class GraphicsData {
  public shape: Shape
  public lineStyle: LineStyle
  public fillStyle: FillStyle
  /**
   * 顶点数组，每2个元素代表一个顶点
   */
  public vertices: number[] = []
  constructor(shape: Shape, fillStyle: FillStyle, lineStyle: LineStyle) {
    this.shape = shape
    this.lineStyle = lineStyle
    this.fillStyle = fillStyle
  }
}

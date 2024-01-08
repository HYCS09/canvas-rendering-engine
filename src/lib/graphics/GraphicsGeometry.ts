import { Shape } from '@/math/shapes/Shape'
import { FillStyle } from './style/FillStyle'
import { LineStyle } from './style/LineStyle'
import { GraphicsData } from './GraphicsData'

export class GraphicsGeometry {
  public graphicsData: GraphicsData[] = []
  constructor() {}
  public drawShape(shape: Shape, fillStyle: FillStyle, lineStyle: LineStyle) {
    const data = new GraphicsData(shape, fillStyle, lineStyle)
    this.graphicsData.push(data)
  }
  public clear() {
    this.graphicsData = []
  }
}

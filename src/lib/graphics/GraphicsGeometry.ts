import { Shape } from '@/math'
import { FillStyle } from './style/FillStyle'
import { LineStyle } from './style/LineStyle'
import { GraphicsData } from './GraphicsData'
import { Point } from '@/math'
import { buildVertices } from './utils/buildVertices'
import { CustomFloatArray } from '@/utils/CustomFloatArray'
import { CustomIntArray } from '@/utils/CustomIntArray'
import { BatchPart } from './utils/BatchPart'
import { triangulateFill } from './utils/triangulateFill'
import { triangulateStroke } from './utils/triangulateStroke'

export class GraphicsGeometry {
  public graphicsData: GraphicsData[] = []
  private dirty = false
  public shapeIndex = 0

  /**
   * 每个batchPart代表一个fill或者一个stroke
   */
  public batchParts: BatchPart[] = []

  /**
   * 顶点数组，每2个元素代表一个顶点
   */
  public vertices = new CustomFloatArray()

  /**
   * 顶点下标数组，每个元素代表一个顶点下标
   */
  public indices = new CustomIntArray()

  constructor() {}

  public drawShape(shape: Shape, fillStyle: FillStyle, lineStyle: LineStyle) {
    const data = new GraphicsData(shape, fillStyle, lineStyle)
    this.graphicsData.push(data)
    this.dirty = true
  }

  /**
   * 将所有子图形都转化成顶点并且进行三角剖分
   */
  public buildVerticesAndTriangulate() {
    if (!this.dirty) {
      return
    }

    this.dirty = false

    for (let i = this.shapeIndex; i < this.graphicsData.length; i++) {
      const data = this.graphicsData[i]

      buildVertices(data)

      if (data.fillStyle.visible) {
        triangulateFill(data, this)
      }
      if (data.lineStyle.visible) {
        triangulateStroke(data, this)
      }
    }

    this.shapeIndex = this.graphicsData.length
  }

  /**
   * @param p 待检测点
   * @returns {boolean} 待检测点是否落在某一个子图形内
   */
  public containsPoint(p: Point): boolean {
    for (let i = 0; i < this.graphicsData.length; i++) {
      const { shape, fillStyle } = this.graphicsData[i]
      if (!fillStyle.visible) {
        continue
      }
      if (shape.contains(p)) {
        return true
      }
    }

    return false
  }
  public clear() {
    this.graphicsData.length = 0
    this.shapeIndex = 0
    this.batchParts.length = 0
    this.vertices.clear()
    this.indices.clear()
  }
}

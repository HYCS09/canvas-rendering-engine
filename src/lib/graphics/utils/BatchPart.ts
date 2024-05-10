import { FillStyle } from '../style/FillStyle'

export class BatchPart {
  public style: FillStyle
  public vertexStart = 0
  public indexStart = 0
  public vertexCount = 0
  public indexCount = 0
  constructor(style: FillStyle) {
    this.style = style
  }
  public start(vertexStart: number, indexStart: number) {
    this.vertexStart = vertexStart
    this.indexStart = indexStart
  }
  public end(vertexCount: number, indexCount: number) {
    if (vertexCount > 65536) {
      throw new Error('每个图形的顶点数量不能超过65536！！！')
    }

    this.vertexCount = vertexCount
    this.indexCount = indexCount
  }
}

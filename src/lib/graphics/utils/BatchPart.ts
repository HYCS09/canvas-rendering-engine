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
    this.vertexCount = vertexCount
    this.indexCount = indexCount
  }
}

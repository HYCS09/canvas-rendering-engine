import { Batch } from '@/batch'
import { Graphics } from './Graphics'
import { BYTES_PER_VERTEX } from '@/constants'

export class GraphicsBatch extends Batch {
  /**
   * 顶点部分在geometry.vertices中的起始下标
   */
  public vertexOffset = 0

  /**
   * 顶点下标部分在geometry.indices中的起始下标
   */
  public indexOffset = 0

  /**
   * 对应的Graphics实例
   */
  graphics!: Graphics

  packVertices(floatView: Float32Array, intView: Uint32Array): void {
    const step = BYTES_PER_VERTEX / 4

    const vertices = this.graphics.geometry.vertices.data

    const offset = this.vertexOffset

    for (let i = 0; i < this.vertexCount; i++) {
      const x = vertices[(offset + i) * 2] // position.x
      const y = vertices[(offset + i) * 2 + 1] // position.y

      const { a, b, c, d, tx, ty } = this.graphics.worldTransform

      const realX = a * x + c * y + tx
      const realY = b * x + d * y + ty

      const vertPos = (this.vertexStart + i) * step

      floatView[vertPos] = realX
      floatView[vertPos + 1] = realY

      intView[vertPos + 2] = this.rgba // color
    }
  }

  packIndices(int32: Uint32Array): void {
    const indices = this.graphics.geometry.indices.data

    const offset = this.indexOffset

    for (let i = 0; i < this.indexCount; i++) {
      int32[this.indexStart + i] = indices[i + offset] + this.vertexStart
    }
  }

  updateVertices(floatView: Float32Array): void {
    const step = BYTES_PER_VERTEX / 4

    const vertices = this.graphics.geometry.vertices.data

    const offset = this.vertexOffset

    const { a, b, c, d, tx, ty } = this.graphics.worldTransform

    for (let i = 0; i < this.vertexCount; i++) {
      const x = vertices[(offset + i) * 2] // position.x
      const y = vertices[(offset + i) * 2 + 1] // position.y

      const vertPos = (this.vertexStart + i) * step

      floatView[vertPos] = a * x + c * y + tx
      floatView[vertPos + 1] = b * x + d * y + ty
    }
  }
}

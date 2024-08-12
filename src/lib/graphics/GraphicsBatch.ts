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
  public graphics!: Graphics

  /**
   * Graphics类子图形的alpha，每次draw或者stroke都可以指定alpha
   */
  public batchAlpha = 1

  packVertices(floatView: Float32Array, intView: Uint32Array): void {
    const step = BYTES_PER_VERTEX / 4

    const vertices = this.graphics.geometry.vertices.data
    const uvs = this.graphics.geometry.uvs.data

    const offset = this.vertexOffset

    const { a, b, c, d, tx, ty } = this.graphics.worldTransform

    for (let i = 0; i < this.vertexCount; i++) {
      const x = vertices[(offset + i) * 2] // position.x
      const y = vertices[(offset + i) * 2 + 1] // position.y
      const u = uvs[(offset + i) * 2]
      const v = uvs[(offset + i) * 2 + 1]

      const vertPos = (this.vertexStart + i) * step

      floatView[vertPos] = a * x + c * y + tx
      floatView[vertPos + 1] = b * x + d * y + ty
      floatView[vertPos + 2] = u
      floatView[vertPos + 3] = v
      intView[vertPos + 4] = this.rgba // color
      intView[vertPos + 5] = this.texture.baseTexture.gpuLocation
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

  public updateAlpha(intView: Uint32Array): void {
    const step = BYTES_PER_VERTEX / 4

    const alpha = Math.round(this.batchAlpha * this.graphics.worldAlpha * 255)

    for (let i = 0; i < this.vertexCount; i++) {
      const vertPos = (this.vertexStart + i) * step

      const rgba = intView[vertPos + 4]

      const rgb = rgba & 0xffffff
      const a = alpha << 24

      intView[vertPos + 4] = rgb + a
    }
  }
}

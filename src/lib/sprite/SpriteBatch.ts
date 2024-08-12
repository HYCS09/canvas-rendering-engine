import { Batch } from '@/batch'
import { BYTES_PER_VERTEX } from '@/constants'
import { Sprite } from './Sprite'

export class SpriteBatch extends Batch {
  /**
   * 对应的Sprite实例
   */
  sprite!: Sprite

  constructor() {
    super()
    this.vertexCount = 4
    this.indexCount = 6
  }

  packVertices(floatView: Float32Array, intView: Uint32Array): void {
    const step = BYTES_PER_VERTEX / 4

    const { vertices, uvs, worldTransform } = this.sprite

    const { a, b, c, d, tx, ty } = worldTransform

    // 顶点数量为固定的4个
    for (let i = 0; i < 4; i++) {
      const x = vertices[i * 2] // position.x
      const y = vertices[i * 2 + 1] // position.y
      const u = uvs[i * 2]
      const v = uvs[i * 2 + 1]

      const vertPos = (this.vertexStart + i) * step

      floatView[vertPos] = a * x + c * y + tx
      floatView[vertPos + 1] = b * x + d * y + ty
      floatView[vertPos + 2] = u
      floatView[vertPos + 3] = v
      intView[vertPos + 4] = this.rgba
      intView[vertPos + 5] = this.texture.baseTexture.gpuLocation
    }
  }

  packIndices(int32: Uint32Array): void {
    // Sprite就是一个矩形，它的顶点下标数组是固定不变的0,1,2,0,2,3
    const { vertexStart, indexStart } = this
    int32[indexStart + 0] = 0 + vertexStart
    int32[indexStart + 1] = 1 + vertexStart
    int32[indexStart + 2] = 2 + vertexStart
    int32[indexStart + 3] = 0 + vertexStart
    int32[indexStart + 4] = 2 + vertexStart
    int32[indexStart + 5] = 3 + vertexStart
  }

  updateVertices(floatView: Float32Array): void {
    const step = BYTES_PER_VERTEX / 4

    const { vertices, worldTransform } = this.sprite

    const { a, b, c, d, tx, ty } = worldTransform

    // 顶点数量为固定的4个
    for (let i = 0; i < 4; i++) {
      const x = vertices[i * 2] // position.x
      const y = vertices[i * 2 + 1] // position.y

      const vertPos = (this.vertexStart + i) * step

      floatView[vertPos] = a * x + c * y + tx
      floatView[vertPos + 1] = b * x + d * y + ty
    }
  }

  public updateAlpha(intView: Uint32Array): void {
    const step = BYTES_PER_VERTEX / 4

    const alpha = Math.round(this.sprite.worldAlpha * 255)

    // 顶点数量为固定的4个
    for (let i = 0; i < 4; i++) {
      const vertPos = (this.vertexStart + i) * step
      const rgba = intView[vertPos + 4]

      const rgb = rgba & 0xffffff
      const a = alpha << 24

      intView[vertPos + 4] = rgb + a
    }
  }
}

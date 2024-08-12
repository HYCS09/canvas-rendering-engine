import { BaseTexture, BaseTextureSource } from './BaseTexture'
import { Rectangle } from '@/math'
import { uniqueId } from 'lodash-es'
import { EMPTY, validateSource } from './utils'

const textureCache: Record<string, Texture> = {}

export class Texture {
  /**
   * 从BaseTexture上截取哪一块？
   */
  public crop: Rectangle

  /**
   * baseTexture
   */
  public baseTexture: BaseTexture

  /**
   * CanvasPattern，在texture填充模式下会使用
   */
  public canvasPattern!: CanvasPattern

  constructor(baseTexture: BaseTexture, crop?: Rectangle) {
    if (crop) {
      if (crop.width === 0 || crop.height === 0) {
        throw new Error(`裁切区域的长宽不能为0`)
      }

      this.crop = crop
    } else {
      this.crop = new Rectangle(0, 0, baseTexture.width, baseTexture.height)
    }

    this.baseTexture = baseTexture
  }

  /**
   * 推荐用这个函数来创建Texture，这种方式会走缓存，避免重复创建相同的Texture
   */
  static from(source: BaseTextureSource) {
    validateSource(source)

    const mySource = source as any

    if (!mySource._textureId) {
      mySource._textureId = uniqueId('texture')
    }

    const cacheId = mySource._textureId

    if (!textureCache[cacheId]) {
      textureCache[cacheId] = new Texture(BaseTexture.from(source))
    }

    return textureCache[cacheId]
  }

  static EMPTY = new Texture(BaseTexture.from(EMPTY))
}

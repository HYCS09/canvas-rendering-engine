import { batchPool } from '@/batch'
import { Container } from '@/display'
import { ObservablePoint } from '@/math'
import { BatchRenderer } from '@/renderer/BatchRenderer'
import { CanvasRenderer } from '@/renderer/CanvasRenderer'
import { BaseTextureSource, Texture } from '@/texture'
import { SpriteBatch } from './SpriteBatch'
import { toRgbaLittleEndian } from '@/utils/color'

export class Sprite extends Container {
  /**
   * 比pivot更便捷的锚点，但实际上是基于pivot的
   */
  public anchor: ObservablePoint

  /**
   * 纹理
   */
  public texture: Texture

  /**
   * 4个顶点坐标
   */
  public vertices = new Float32Array(8)

  /**
   * 4个uv坐标
   */
  public uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])

  /**
   * Sprite的宽度
   */
  private _width = 0

  /**
   * Sprite的高度
   */
  private _height = 0

  /**
   * 原生宽度，等于texture的裁切区域的宽度
   */
  private naturalWidth = 0

  /**
   * 原生高度，等于texture的裁切区域的高度
   */
  private naturalHeight = 0

  constructor(texture: Texture) {
    super()

    this.type = 'sprite'

    this.texture = texture

    this.anchor = new ObservablePoint(this.onAnchorChange)

    this.handleTextureLoaded()
  }

  private onAnchorChange = (x: number, y: number) => {
    this.pivot.set(this.naturalWidth * x, this.naturalHeight * y)
  }

  get width() {
    return this._width
  }

  set width(value: number) {
    this._width = value

    this.scale.x = this._width / this.naturalWidth
  }

  get height() {
    return this._height
  }

  set height(value: number) {
    this._height = value

    this.scale.y = this._height / this.naturalHeight
  }

  private handleTextureLoaded() {
    const {
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight
    } = this.texture.crop

    const { width: baseTextureWidth, height: baseTextureHeight } =
      this.texture.baseTexture
    if (
      cropX + cropWidth > baseTextureWidth ||
      cropY + cropHeight > baseTextureHeight ||
      cropX > baseTextureWidth ||
      cropY > baseTextureHeight
    ) {
      console.error(
        `部分截取区域超出了资源本身的内容区域，在Canvas2D渲染模式下会出现部分内容被截掉的情况`
      )
    }

    this.naturalWidth = cropWidth
    this.naturalHeight = cropHeight

    // 更新顶点数据
    this.vertices.set([
      0,
      0,
      cropWidth,
      0,
      cropWidth,
      cropHeight,
      0,
      cropHeight
    ])
    // 更新uv坐标数据
    const { width: bWidth, height: bHeight } = this.texture.baseTexture
    this.uvs.set([
      cropX / bWidth,
      cropY / bHeight,
      (cropX + cropWidth) / bWidth,
      cropY / bHeight,
      (cropX + cropWidth) / bWidth,
      (cropY + cropHeight) / bHeight,
      cropX / bWidth,
      (cropY + cropHeight) / bHeight
    ])

    if (!this._width) {
      this._width = cropWidth
    }
    if (!this._height) {
      this._height = cropHeight
    }

    this.scale.set(
      this._width / this.naturalWidth,
      this._height / this.naturalHeight
    )

    if (this.anchor.x || this.anchor.y) {
      this.onAnchorChange(this.anchor.x, this.anchor.y)
    }
  }

  public renderCanvas(renderer: CanvasRenderer): void {
    const ctx = renderer.ctx
    const texture = this.texture

    const source = texture.baseTexture.source

    ctx.globalAlpha = this.worldAlpha

    const { a, b, c, d, tx, ty } = this.worldTransform
    ctx.setTransform(a, b, c, d, tx, ty)

    const crop = texture.crop

    ctx.drawImage(
      source,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    )
  }

  public buildBatches(batchRenderer: BatchRenderer) {
    this.worldId = this.transform.worldId
    this.alphaDirty = false

    const batch = batchPool.get(this.type) as SpriteBatch

    batch.rgba = toRgbaLittleEndian('#ffffff', this.worldAlpha)
    batch.texture = this.texture

    batch.sprite = this

    batchRenderer.addBatch(batch)

    this.batches[0] = batch

    this.batchCount = 1
  }

  /**
   * 快速创建一个Sprite
   */
  static from(source: BaseTextureSource) {
    const texture = Texture.from(source)

    return new Sprite(texture)
  }
}

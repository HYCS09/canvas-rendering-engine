import { Container } from '@/display'
import { LineStyle } from '@/graphics/style/LineStyle'
import { FillStyle } from '@/graphics/style/FillStyle'
import { ILineStyleOptions } from '@/types'
import { Polygon } from '@/math/shapes/Polygon'
import { GraphicsGeometry } from './GraphicsGeometry'
import { Shape } from '@/math/shapes/Shape'
import { Rectangle } from '@/math/shapes/Rectangle'
import { CanvasRenderer } from '@/renderer/CanvasRenderer'

export class Graphics extends Container {
  private _lineStyle = new LineStyle()
  private _fillStyle = new FillStyle()
  private _geometry = new GraphicsGeometry()
  public currentPath: Polygon | null = null

  constructor() {
    super()
  }

  public lineStyle(options?: ILineStyleOptions) {
    Object.assign(this._lineStyle, options)
    return this
  }

  protected drawShape(shape: Shape) {
    this._geometry.drawShape(
      shape,
      this._fillStyle.clone(),
      this._lineStyle.clone()
    )
    return this
  }

  /**
   * 清空已有的path，开始新的path
   */
  protected startPoly(): void {
    if (this.currentPath) {
      const len = this.currentPath.points.length

      if (len > 2) {
        // 如果超过2个点，那么就算一个合法的path
        this.drawShape(this.currentPath)
      }
    }

    this.currentPath = new Polygon()
  }

  public beginFill(color = '#000000', alpha = 1) {
    if (this.currentPath) {
      // 在填充参数变化之前，先将已有的path画出来
      this.startPoly()
    }

    this._fillStyle.color = color
    this._fillStyle.alpha = alpha

    if (this._fillStyle.alpha > 0) {
      this._fillStyle.visible = true
    }

    return this
  }

  public endFill() {
    this.startPoly()

    this._fillStyle.reset()

    return this
  }

  public drawRect(x: number, y: number, width: number, height: number): this {
    return this.drawShape(new Rectangle(x, y, width, height))
  }

  public clear() {
    this._geometry.clear()
    this._lineStyle.reset()
    this._fillStyle.reset()
    this.currentPath = null

    return this
  }

  protected renderCanvas(render: CanvasRenderer) {
    const ctx = render.ctx
    const { a, b, c, d, tx, ty } = this.transform.worldTransform

    ctx.setTransform(a, b, c, d, tx, ty)

    const graphicsData = this._geometry.graphicsData

    for (let i = 0; i < graphicsData.length; i++) {
      const data = graphicsData[i]
      const { lineStyle, fillStyle, shape } = data

      if (shape instanceof Rectangle) {
        const rectangle = shape
        if (fillStyle.visible) {
          ctx.fillStyle = fillStyle.color
          ctx.globalAlpha = fillStyle.alpha * this.worldAlpha
          ctx.fillRect(
            rectangle.x,
            rectangle.y,
            rectangle.width,
            rectangle.height
          )
        }
        if (lineStyle.visible) {
          ctx.lineWidth = lineStyle.width
          ctx.lineCap = lineStyle.cap
          ctx.lineJoin = lineStyle.join
          ctx.strokeStyle = lineStyle.color
          ctx.globalAlpha = lineStyle.alpha * this.worldAlpha

          ctx.strokeRect(
            rectangle.x,
            rectangle.y,
            rectangle.width,
            rectangle.height
          )
        }
      }
    }
  }
}

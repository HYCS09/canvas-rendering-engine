import { Container } from '@/display'
import { IApplicationOptions } from '@/types'
import { Renderer } from './Renderer'

export class CanvasRenderer extends Renderer {
  public ctx: CanvasRenderingContext2D
  private backgroundColor: string
  private backgroundAlpha: number
  constructor(options: IApplicationOptions) {
    super(options)
    const { backgroundColor = '#000000', backgroundAlpha = 1 } = options
    this.backgroundColor = backgroundColor
    this.backgroundAlpha = backgroundAlpha
    this.ctx = this.canvasEle.getContext('2d') as CanvasRenderingContext2D
  }
  public render(container: Container) {
    container.updateTransform()
    const ctx = this.ctx

    ctx.save()

    ctx.clearRect(0, 0, this.screen.width, this.screen.height)

    if (this.backgroundColor) {
      ctx.globalAlpha = this.backgroundAlpha
      ctx.fillStyle = this.backgroundColor
      ctx.fillRect(0, 0, this.screen.width, this.screen.height)
    }

    container.renderCanvasRecursive(this)

    ctx.restore()
  }
}

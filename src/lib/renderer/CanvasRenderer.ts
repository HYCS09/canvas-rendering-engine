import { Container } from '@/display'
import { IApplicationOptions } from '@/types'
import { Renderer } from './Renderer'

export class CanvasRenderer extends Renderer {
  public ctx: CanvasRenderingContext2D
  private backgroundColor: string
  private backgroundAlpha: number
  constructor(options: IApplicationOptions) {
    console.log(
      '正在使用 %c canvas2D ',
      'color: #05aa6d; background-color: #ffffff;font-size: 20px;',
      '渲染'
    )

    super(options)
    const { backgroundColor, backgroundAlpha } = options
    this.backgroundColor = backgroundColor as string
    this.backgroundAlpha = backgroundAlpha as number
    this.ctx = this.canvasEle.getContext('2d') as CanvasRenderingContext2D
  }
  public render(container: Container) {
    container.updateTransform()
    const ctx = this.ctx

    ctx.save()

    ctx.clearRect(0, 0, this.screen.width, this.screen.height)

    // 绘制background
    ctx.globalAlpha = this.backgroundAlpha
    ctx.fillStyle = this.backgroundColor
    ctx.fillRect(0, 0, this.screen.width, this.screen.height)

    container.renderCanvasRecursive(this)

    ctx.restore()
  }
}

import { Container } from '@/display'
import { IApplicationOptions } from '@/types'
import { Renderer } from './Renderer'
import { message } from 'antd'

export class CanvasRenderer extends Renderer {
  public ctx: CanvasRenderingContext2D
  private backgroundColor: string
  private backgroundAlpha: number
  private offscreenCanvas = document.createElement('canvas')
  public offscreenCtx: CanvasRenderingContext2D
  constructor(options: IApplicationOptions) {
    super(options)
    const { backgroundColor = '#000000', backgroundAlpha = 1 } = options
    this.backgroundColor = backgroundColor
    this.backgroundAlpha = backgroundAlpha
    this.ctx = this.canvasEle.getContext('2d') as CanvasRenderingContext2D

    // 注意要设置这个离屏canvas元素的宽度和高度，否则调用getImageData将会得到一堆黑色的色值
    this.offscreenCanvas.width = 1000
    this.offscreenCanvas.height = 1000
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', {
      willReadFrequently: true
    }) as CanvasRenderingContext2D

    this.canvasEle.addEventListener('click', (e) => {
      // 取到鼠标落点对应的那个像素
      const [r, g, b] = this.offscreenCtx.getImageData(
        e.offsetX,
        e.offsetY,
        1,
        1
      ).data

      // 将10进制转化成16进制，注意有可能出现转化后只有1位的情况，这个时候需要补一个0
      const hexR =
        r.toString(16).length === 1 ? '0' + r.toString(16) : r.toString(16)
      const hexG =
        g.toString(16).length === 1 ? '0' + g.toString(16) : g.toString(16)
      const hexB =
        b.toString(16).length === 1 ? '0' + b.toString(16) : b.toString(16)
      const color = `#${hexR}${hexG}${hexB}`

      // 去map上取到对应的碰撞对象
      const target = Container.hitTestMap[color]

      if (target?.uniqueColor) {
        message.success(`点到了色值为${target.uniqueColor}的元素`)
      } else {
        message.error(`没有点到任何元素`)
      }
    })
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

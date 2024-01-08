import { Container } from '@/display'
import { Rectangle } from '@/math'
import { IApplicationOptions } from '@/types'

export class Renderer {
  public canvasEle: HTMLCanvasElement
  public screen = new Rectangle()
  constructor(options: IApplicationOptions) {
    const { view } = options
    this.canvasEle = view
    this.screen.width = view.width
    this.screen.height = view.height
  }
  public resizeView(width: number, height: number) {
    this.canvasEle.width = width
    this.canvasEle.height = height
  }
  public render(container: Container) {
    // nothing
  }
}

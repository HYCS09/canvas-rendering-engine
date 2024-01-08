import { Renderer } from './renderer/Renderer'
import { IApplicationOptions } from '@/types'
import { getRenderer } from './utils'
import { Container } from '@/display'

export class Application {
  private renderer: Renderer
  public stage = new Container()
  public view: HTMLCanvasElement

  constructor(options: IApplicationOptions) {
    const { view } = options
    this.view = view

    this.renderer = getRenderer(options)

    this.start()
  }

  private render() {
    this.renderer.render(this.stage)
  }

  private start() {
    const func = () => {
      this.render()
      requestAnimationFrame(func)
    }
    func()
  }
}

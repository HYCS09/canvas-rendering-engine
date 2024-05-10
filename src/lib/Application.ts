import { Renderer } from './renderer/Renderer'
import { IApplicationOptions } from '@/types'
import { getRenderer, normalizeOptions } from './utils'
import { Container } from '@/display'
import { EventSystem } from '@/events'

export class Application {
  private readonly renderer: Renderer
  public readonly stage = new Container()
  public readonly view: HTMLCanvasElement
  private eventSystem: EventSystem

  constructor(options: IApplicationOptions) {
    normalizeOptions(options)

    const { view } = options
    this.view = view

    this.renderer = getRenderer(options)

    this.eventSystem = new EventSystem(this.view, this.stage)

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

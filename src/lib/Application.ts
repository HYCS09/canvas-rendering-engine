import { Renderer } from './renderer/Renderer'
import { IApplicationOptions } from '@/types'
import { getRenderer, normalizeOptions } from './utils'
import { Container } from '@/display'
import { EventSystem } from '@/events'

export class Application {
  private renderer!: Renderer
  public readonly stage = new Container()
  public readonly view: HTMLCanvasElement
  private readonly eventSystem: EventSystem
  private readonly options: IApplicationOptions

  constructor(options: IApplicationOptions) {
    normalizeOptions(options)
    this.options = options

    this.stage.onStage = true

    const { view } = options
    this.view = view

    this.eventSystem = new EventSystem(this.view, this.stage)
  }

  public async init() {
    this.renderer = await getRenderer(this.options)
    await this.renderer.init()
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

    requestAnimationFrame(func)
  }
}

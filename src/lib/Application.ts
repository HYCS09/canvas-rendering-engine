import { Renderer } from './renderer/Renderer'
import { IApplicationOptions } from '@/types'
import { getRenderer } from './utils'
import { Container } from '@/display'
import { Point } from './math'

let hasFoundTarget = false
let hitTarget: Container | null = null

const hitTestRecursive = (curTarget: Container, globalPos: Point) => {
  // 如果对象不可见
  if (!curTarget.visible) {
    return
  }

  if (hasFoundTarget) {
    return
  }

  // 深度优先遍历子元素
  for (let i = curTarget.children.length - 1; i >= 0; i--) {
    const child = curTarget.children[i]
    hitTestRecursive(child, globalPos)
  }

  if (hasFoundTarget) {
    return
  }

  // 最后检测自身
  const p = curTarget.worldTransform.applyInverse(globalPos)
  if (curTarget.containsPoint(p)) {
    hitTarget = curTarget
    hasFoundTarget = true
  }
}

const hitTest = (root: Container, globalPos: Point): Container | null => {
  hasFoundTarget = false
  hitTarget = null

  hitTestRecursive(root, globalPos)

  return hitTarget
}

export class Application {
  private renderer: Renderer
  public readonly stage = new Container()
  public view: HTMLCanvasElement

  constructor(options: IApplicationOptions) {
    const { view } = options
    this.view = view

    this.renderer = getRenderer(options)

    this.start()

    this.view.addEventListener('pointermove', (e) => {
      const target = hitTest(this.stage, new Point(e.offsetX, e.offsetY))
      if (target) {
        this.view.style.cursor = 'pointer'
      } else {
        this.view.style.cursor = 'auto'
      }
    })

    this.view.addEventListener('click', (e) => {
      const target = hitTest(this.stage, new Point(e.offsetX, e.offsetY))
      if (target) {
        target.emit('click')
      }
    })
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

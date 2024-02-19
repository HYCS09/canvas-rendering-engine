import { Container } from '@/display'
import { EventBoundary } from './EventBoundary'
import { FederatedEventMap, FederatedMouseEvent } from './FederatedMouseEvent'

export class EventSystem {
  private canvasEle: HTMLCanvasElement // canvas元素
  private eventBoundary: EventBoundary
  private rootEvent = new FederatedMouseEvent()
  constructor(canvasEle: HTMLCanvasElement, stage: Container) {
    this.canvasEle = canvasEle
    this.eventBoundary = new EventBoundary(stage)
    this.addEvents()
  }
  private addEvents = () => {
    this.canvasEle.addEventListener('pointermove', this.onPointerMove, true)
    this.canvasEle.addEventListener('pointerleave', this.onPointerLeave, true)
    this.canvasEle.addEventListener('pointerdown', this.onPointerDown, true)
    this.canvasEle.addEventListener('pointerup', this.onPointerup, true)
  }
  private onPointerMove = (nativeEvent: PointerEvent) => {
    this.bootstrapEvent(nativeEvent)
    this.eventBoundary.fireEvent(this.rootEvent)
    this.setCursor()
  }
  private onPointerLeave = () => {
    this.eventBoundary.overTargets = []
  }
  private onPointerDown = (nativeEvent: PointerEvent) => {
    this.bootstrapEvent(nativeEvent)
    this.eventBoundary.fireEvent(this.rootEvent)
  }
  private onPointerup = (nativeEvent: PointerEvent) => {
    this.bootstrapEvent(nativeEvent)
    this.eventBoundary.fireEvent(this.rootEvent)
  }
  private bootstrapEvent = (nativeEvent: PointerEvent) => {
    this.rootEvent.isTrusted = nativeEvent.isTrusted
    this.rootEvent.timeStamp = performance.now()
    this.rootEvent.type = nativeEvent.type.replace(
      'pointer',
      'mouse'
    ) as keyof FederatedEventMap
    this.rootEvent.button = nativeEvent.button
    this.rootEvent.buttons = nativeEvent.buttons
    this.rootEvent.global.x = nativeEvent.offsetX
    this.rootEvent.global.y = nativeEvent.offsetY
  }
  private setCursor = () => {
    this.canvasEle.style.cursor = this.eventBoundary.cursor
  }
}

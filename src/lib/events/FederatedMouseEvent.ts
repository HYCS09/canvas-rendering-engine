import { Point } from '@/math'
import { EventPhase } from './constant'
import { Container } from '@/display'

export class FederatedMouseEvent {
  public isTrusted = true
  public timeStamp = 0
  public type: keyof FederatedEventMap = 'mousemove'
  public button = 0
  public buttons = 0
  public global = new Point()
  public propagationStopped = false
  public eventPhase = EventPhase.NONE
  public target = new Container()
  public currentTarget = new Container()

  public stopPropagation() {
    this.propagationStopped = true
  }
}

export type FederatedEventMap = {
  mousedown: FederatedMouseEvent
  mouseup: FederatedMouseEvent
  click: FederatedMouseEvent
  mouseenter: FederatedMouseEvent
  mouseleave: FederatedMouseEvent
  mousemove: FederatedMouseEvent
  mouseout: FederatedMouseEvent
  mouseover: FederatedMouseEvent
}

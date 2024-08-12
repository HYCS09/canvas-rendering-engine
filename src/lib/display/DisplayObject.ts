import {
  DEG_TO_RAD,
  ObservablePoint,
  RAD_TO_DEG,
  Shape,
  Transform
} from '@/math'
import Eventemitter from 'eventemitter3'
import { Container } from './Container'
import { Cursor, FederatedEventMap } from '@/events'
import { Renderer } from '@/renderer/Renderer'

const listener = () => {
  Renderer.needBuildArr = true
}

export abstract class DisplayObject extends Eventemitter {
  private _alpha = 1
  public _worldAlpha = 1
  protected alphaDirty = true
  private _visible = true
  public transform = new Transform()
  protected _zIndex = 0
  public parent: Container | null = null
  public hitArea: Shape | null = null
  public cursor: Cursor = 'auto'
  public onStage = false

  constructor() {
    super()
    this.on('need-rebuild-arr', listener)
  }

  get worldAlpha() {
    return this._worldAlpha
  }

  set worldAlpha(value: number) {
    if (value === this._worldAlpha) {
      return
    }

    this._worldAlpha = value
    this.alphaDirty = true
  }

  get alpha() {
    return this._alpha
  }

  set alpha(value: number) {
    if (value === this._alpha) {
      return
    }

    if (value > 1 || value < 0) {
      throw new Error(`alpha必须为0-1之间的值`)
    }

    this._alpha = value
  }

  get visible() {
    return this._visible
  }

  set visible(val: boolean) {
    if (val === this._visible) {
      return
    }

    this._visible = val

    if (this.onStage) {
      this.emit('need-rebuild-arr')
    }
  }

  get zIndex(): number {
    return this._zIndex
  }

  set zIndex(value: number) {
    if (value === this.zIndex) {
      return
    }

    this._zIndex = value

    if (this.parent) {
      this.parent.sortDirty = true
    }

    if (this.onStage) {
      this.emit('need-rebuild-arr')
    }
  }

  get position(): ObservablePoint {
    return this.transform.position
  }

  get localTransform() {
    return this.transform.localTransform
  }

  get worldTransform() {
    return this.transform.worldTransform
  }

  get x(): number {
    return this.position.x
  }

  set x(value: number) {
    this.transform.position.x = value
  }

  get y(): number {
    return this.position.y
  }

  set y(value: number) {
    this.transform.position.y = value
  }

  get scale(): ObservablePoint {
    return this.transform.scale
  }

  get pivot(): ObservablePoint {
    return this.transform.pivot
  }

  get skew(): ObservablePoint {
    return this.transform.skew
  }

  /**
   * 旋转角度-弧度制
   */
  get rotation(): number {
    return this.transform.rotation
  }

  set rotation(value: number) {
    this.transform.rotation = value
  }

  /**
   * 旋转角度-角度制
   */
  get angle(): number {
    return this.transform.rotation * RAD_TO_DEG
  }

  set angle(value: number) {
    this.transform.rotation = value * DEG_TO_RAD
  }

  public addEventListener<K extends keyof FederatedEventMap>(
    type: K,
    listener: (e: FederatedEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    const capture =
      (typeof options === 'boolean' && options) ||
      (typeof options === 'object' && options.capture)

    const realType = capture ? `${type}capture` : type

    if (typeof options === 'object' && options.once) {
      this.once(realType, listener)
    } else {
      this.on(realType, listener)
    }
  }

  public removeEventListener<K extends keyof FederatedEventMap>(
    type: K,
    listener: (e: FederatedEventMap[K]) => any,
    capture?: boolean
  ) {
    const realType = capture ? `${type}capture` : type
    this.off(realType, listener)
  }
}

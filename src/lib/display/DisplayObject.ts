import { DEG_TO_RAD, ObservablePoint, RAD_TO_DEG, Transform } from '@/math'
import { default as Eventemitter } from 'eventemitter3'
import { Container } from './Container'

export abstract class DisplayObject extends Eventemitter {
  public alpha = 1
  public worldAlpha = 1
  public visible = true
  public transform = new Transform()
  protected _zIndex = 0
  public parent: Container | null = null

  public updateTransform() {
    const parentTransform = this.parent?.transform || new Transform()
    this.transform.updateTransform(parentTransform)
    this.worldAlpha = this.alpha * (this.parent?.worldAlpha || 1)
  }

  get zIndex(): number {
    return this._zIndex
  }

  set zIndex(value: number) {
    this._zIndex = value
    if (this.parent) {
      this.parent.sortDirty = true
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

  get rotation(): number {
    return this.transform.rotation
  }

  set rotation(value: number) {
    this.transform.rotation = value
  }

  get angle(): number {
    return this.transform.rotation * RAD_TO_DEG
  }

  set angle(value: number) {
    this.transform.rotation = value * DEG_TO_RAD
  }
}

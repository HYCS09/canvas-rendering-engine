import { LineCap, LineJoin } from '@/enums'
import { FillStyle } from './FillStyle'

export class LineStyle extends FillStyle {
  public width = 0
  public cap = LineCap.Butt
  public join = LineJoin.Miter

  public clone(): LineStyle {
    const obj = new LineStyle()

    obj.color = this.color
    obj.alpha = this.alpha
    obj.visible = this.visible
    obj.width = this.width
    obj.cap = this.cap
    obj.join = this.join

    return obj
  }

  public reset(): void {
    super.reset()

    this.color = '#ffffff'
    this.width = 0
    this.cap = LineCap.Butt
    this.join = LineJoin.Miter
  }
}

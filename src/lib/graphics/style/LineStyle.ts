import { LINE_CAP, LINE_JOIN } from '@/enums'
import { FillStyle } from './FillStyle'

export class LineStyle extends FillStyle {
  public width = 0
  public cap = LINE_CAP.BUTT
  public join = LINE_JOIN.MITER
  public miterLimit = 10

  public clone(): LineStyle {
    const obj = new LineStyle()

    obj.color = this.color
    obj.alpha = this.alpha
    obj.visible = this.visible
    obj.width = this.width
    obj.cap = this.cap
    obj.join = this.join
    obj.miterLimit = this.miterLimit

    return obj
  }

  public reset(): void {
    super.reset()

    this.color = '#ffffff'
    this.width = 0
    this.cap = LINE_CAP.BUTT
    this.join = LINE_JOIN.MITER
    this.miterLimit = 10
  }
}

export class FillStyle {
  public color = '#ffffff'
  public alpha = 1.0
  public visible = false

  constructor() {
    this.reset()
  }

  public clone(): FillStyle {
    const obj = new FillStyle()

    obj.color = this.color
    obj.alpha = this.alpha
    obj.visible = this.visible

    return obj
  }

  public reset(): void {
    this.color = '#ffffff'
    this.alpha = 1
    this.visible = false
  }
}

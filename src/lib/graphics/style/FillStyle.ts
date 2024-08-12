import { Texture } from '@/texture'

export class FillStyle {
  public color = '#ffffff'
  public alpha = 1
  public visible = false
  public texture = Texture.EMPTY

  constructor() {
    this.reset()
  }

  public clone(): FillStyle {
    const obj = new FillStyle()

    obj.color = this.color
    obj.alpha = this.alpha
    obj.visible = this.visible
    obj.texture = this.texture

    return obj
  }

  public reset(): void {
    this.color = '#ffffff'
    this.alpha = 1
    this.visible = false
    this.texture = Texture.EMPTY
  }
}

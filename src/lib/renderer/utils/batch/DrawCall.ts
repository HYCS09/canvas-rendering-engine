import { BaseTexture } from '@/texture'

export class DrawCall {
  /**
   * 顶点下标数组起点
   */
  public start = 0

  /**
   * 顶点数量
   */
  public size = 0

  /**
   * 这个drawCall包含了多少张base texture
   */
  public texCount = 0

  /**
   * 这个drawCall包含的base texture
   */
  public baseTextures: BaseTexture[] = []

  /**
   * webGPU中会用到，用作bind group的缓存key
   */
  public bindGroupKey = ''

  /**
   * 更新bindGroupKey
   */
  public updateBindGroupKey() {
    this.bindGroupKey = this.baseTextures.map((i) => i.uid).join('|')
  }
}

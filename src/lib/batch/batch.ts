import { Texture } from '@/texture'

export abstract class Batch {
  /**
   * 顶点个数
   */
  public vertexCount = 0

  /**
   * 顶点下标个数
   */
  public indexCount = 0

  /**
   * rgba的小端序形式
   */
  public rgba = 0

  /**
   * 顶点数据在大数组中的起点，这个属性会被BatchRenderer接管
   */
  public vertexStart = 0

  /**
   * 顶点下标数据在大数组中的起点，这个属性会被BatchRenderer接管
   */
  public indexStart = 0

  /**
   * texture
   */
  public texture = Texture.EMPTY

  /**
   * 将顶点数据写入大数组中
   */
  public abstract packVertices(
    floatView: Float32Array,
    intView: Uint32Array
  ): void

  /**
   * 将顶点下标数据写入大数组中
   */
  public abstract packIndices(int32: Uint32Array): void

  /**
   * 在大数组中更新顶点位置数据
   */
  public abstract updateVertices(floatView: Float32Array): void

  /**
   * 在大数组中更新透明度
   */
  public abstract updateAlpha(intView: Uint32Array): void
}

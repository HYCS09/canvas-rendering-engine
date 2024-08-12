import { Container } from '@/display'
import { IApplicationOptions } from '@/types'
import { Renderer } from './Renderer'
import { Batch, batchPool } from '@/batch'
import { BYTES_PER_VERTEX, MAX_TEXTURES_COUNT } from '@/constants'
import { buildArray } from './utils/batch/buildArray'
import { updateArray } from './utils/batch/updateArray'
import { DrawCall } from './utils/batch/DrawCall'
import { Texture } from '@/texture'

let globalTick = 0

export abstract class BatchRenderer extends Renderer {
  /**
   * 顶点个数
   */
  protected vertexCount = 0

  /**
   * 顶点下标个数
   */
  protected indexCount = 0

  /**
   * 所有batch
   */
  protected batches: Batch[] = []

  /**
   * batch数量
   */
  protected batchesCount = 0

  /**
   * 所有的drawCall对象
   */
  protected drawCalls: DrawCall[] = []

  /**
   * drawCall对象数量
   */
  protected drawCallCount = 0

  /**
   * 顶点数组float32视图
   */
  protected vertFloatView: Float32Array

  /**
   * 顶点数组Uint32视图
   */
  protected vertIntView: Uint32Array

  /**
   * 顶点下标数组
   */
  protected indexBuffer: Uint32Array

  /**
   * 当前的webGL｜webGPU vertex buffer的长度
   */
  protected curVertBufferLength = 0

  /**
   * 当前的webGL｜webGPU index buffer的长度
   */
  protected curIndexBufferLength = 0

  constructor(options: IApplicationOptions) {
    super(options)

    const arrayBuffer = new ArrayBuffer(256 * BYTES_PER_VERTEX)

    this.vertFloatView = new Float32Array(arrayBuffer)
    this.vertIntView = new Uint32Array(arrayBuffer)

    this.indexBuffer = new Uint32Array(256)
  }

  public addBatch(batch: Batch) {
    batch.vertexStart = this.vertexCount
    batch.indexStart = this.indexCount

    this.vertexCount += batch.vertexCount
    this.indexCount += batch.indexCount
    this.batches[this.batchesCount] = batch
    this.batchesCount++
  }

  protected startBuild() {
    this.vertexCount = 0
    this.indexCount = 0
    this.batchesCount = 0
    this.drawCallCount = 0
    batchPool.reset()
  }

  protected buildEnd() {
    this.resizeBufferIfNeeded()
    this.packData()
  }

  /**
   * 如果现有的typed array放不下了，则新建一个
   */
  protected resizeBufferIfNeeded() {
    if (this.vertexCount * BYTES_PER_VERTEX > this.vertFloatView.byteLength) {
      const arrayBuffer = new ArrayBuffer(this.vertexCount * BYTES_PER_VERTEX)
      this.vertFloatView = new Float32Array(arrayBuffer)
      this.vertIntView = new Uint32Array(arrayBuffer)
    }

    if (this.indexCount > this.indexBuffer.length) {
      this.indexBuffer = new Uint32Array(this.indexCount)
    }
  }

  /**
   * 将数据打包到大数组里并且构建draw call
   */
  protected packData() {
    let drawCall = (this.drawCalls[this.drawCallCount] ??= new DrawCall())
    drawCall.texCount = 0

    let lastBatch = this.batches[0]

    for (let i = 0; i < this.batchesCount; i++) {
      const batch = this.batches[i]

      lastBatch = this.batches[i]

      const baseTexture = batch.texture.baseTexture

      if (baseTexture.drawCallTick !== globalTick) {
        // 如果塞满了16张texture，则需要进入到下一个draw call
        if (drawCall.texCount >= MAX_TEXTURES_COUNT) {
          // 首先计算出这次draw call需要绘制哪些顶点
          const lastDrawCall = this.drawCalls[this.drawCallCount - 1]
          const start = lastDrawCall
            ? lastDrawCall.start + lastDrawCall.size
            : 0
          const size = batch.indexStart + batch.indexCount - start
          drawCall.start = start
          drawCall.size = size
          drawCall.updateBindGroupKey()

          // 进入下一个draw call
          this.drawCallCount++
          drawCall = this.drawCalls[this.drawCallCount] ??= new DrawCall()
          drawCall.texCount = 0

          globalTick++
        }

        baseTexture.drawCallTick = globalTick

        drawCall.baseTextures[drawCall.texCount] = baseTexture
        baseTexture.gpuLocation = drawCall.texCount
        drawCall.texCount++
      }

      batch.packVertices(this.vertFloatView, this.vertIntView)
      batch.packIndices(this.indexBuffer)
    }

    if (drawCall.texCount > 0) {
      const lastDrawCall = this.drawCalls[this.drawCallCount - 1]
      const start = lastDrawCall ? lastDrawCall.start + lastDrawCall.size : 0
      const size = lastBatch.indexStart + lastBatch.indexCount - start
      drawCall.start = start
      drawCall.size = size

      // 补充空白
      if (drawCall.texCount < MAX_TEXTURES_COUNT) {
        const diff = MAX_TEXTURES_COUNT - drawCall.texCount
        for (let i = 0; i < diff; i++) {
          drawCall.baseTextures[drawCall.texCount] = Texture.EMPTY.baseTexture
          drawCall.texCount++
        }
      }
      drawCall.updateBindGroupKey()

      this.drawCallCount++
    }

    globalTick++
  }

  /**
   * 调用webGL或webGPU的绘制api将内容绘制出来
   */
  protected abstract draw(): void

  /**
   * 更新vertex buffer和index buffer
   */
  protected abstract updateBuffer(): void

  /**
   * 设置投影矩阵，这是为了适配canvas元素的尺寸
   */
  protected abstract setProjectionMatrix(): void

  /**
   * 更新stage的transform对应的uniform变量
   */
  protected abstract setRootTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
  ): void

  /**
   * 更新子节点的transform
   */
  protected updateChildrenTransform(rootContainer: Container) {
    rootContainer.sortChildren()

    const dirty = rootContainer.transform.shouldUpdateLocalTransform

    rootContainer.transform.updateLocalTransform()

    if (dirty) {
      const { a, b, c, d, tx, ty } = rootContainer.transform.localTransform
      this.setRootTransform(a, b, c, d, tx, ty)
    }

    rootContainer.worldAlpha = rootContainer.alpha

    const children = rootContainer.children
    for (let i = 0; i < children.length; i++) {
      children[i].updateTransform()
    }
  }

  /**
   * 更新节点的位置信息并渲染
   */
  public render(rootContainer: Container): void {
    this.updateChildrenTransform(rootContainer)

    /**
     * 判断是否需要重新构建大数组
     */
    if (Renderer.needBuildArr) {
      this.startBuild()

      buildArray(this, rootContainer)

      this.buildEnd()

      Renderer.needBuildArr = false
    } else {
      updateArray(this.vertFloatView, this.vertIntView, rootContainer)
    }

    this.updateBuffer()

    this.draw()
  }
}

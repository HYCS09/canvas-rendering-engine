import { Batch } from '@/batch'
import { DisplayObject } from './DisplayObject'
import { Point, Transform } from '@/math'
import { BatchRenderer } from '@/renderer/BatchRenderer'
import { CanvasRenderer } from '@/renderer/CanvasRenderer'

export class Container extends DisplayObject {
  public type = 'container'

  /**
   * 是否需要对children排序
   */
  public sortDirty = false

  /**
   * 所有子元素
   */
  public readonly children: Container[] = []

  /**
   * 用来标记worldTransform是否发生了改变
   */
  protected worldId = 0

  /**
   * 所有batch
   */
  protected batches: Batch[] = []

  /**
   * batch总数
   */
  protected batchCount = 0

  /**
   * 使用canvas2D，渲染自身，在container上面没有东西要渲染，所以这个函数的内容为空
   */
  protected renderCanvas(renderer: CanvasRenderer) {
    // nothing
  }

  /**
   * 使用canvas2D，递归渲染以自身为根的整棵节点树
   */
  public renderCanvasRecursive(renderer: CanvasRenderer) {
    // 如果visible为false，那么自身以及自身的所有子节点都不用渲染
    if (!this.visible || this.worldAlpha <= 0) {
      return
    }

    this.renderCanvas(renderer)

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].renderCanvasRecursive(renderer)
    }
  }

  /**
   * 递归更新当前元素以及所有子元素的transform
   */
  public updateTransform() {
    if (!this.visible) {
      return
    }

    this.sortChildren()

    this.worldAlpha = (this.parent?.worldAlpha ?? 1) * this.alpha

    const parentTransform = this.parent?.transform || new Transform()
    this.transform.updateTransform(parentTransform)

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateTransform()
    }
  }

  /**
   * 添加节点后需要更新节点的onStage属性
   */
  public updateOnStage(val: boolean) {
    this.onStage = val

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateOnStage(val)
    }
  }

  public addChild(child: Container) {
    child.parent?.removeChild(child) // 将要添加的child从它的父元素的children中移除

    this.children.push(child)
    child.parent = this // 将要添加的child的parent指向this
    this.sortDirty = true

    if (this.onStage) {
      child.updateOnStage(true)
      this.emit('need-rebuild-arr')
    }
  }
  public removeChild(child: Container) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1)
        child.parent = null

        if (this.onStage) {
          child.updateOnStage(false)
          this.emit('need-rebuild-arr')
        }

        return
      }
    }
  }
  public sortChildren() {
    if (!this.sortDirty) {
      return
    }

    this.children.sort((a, b) => a.zIndex - b.zIndex)
    this.sortDirty = false
  }
  public containsPoint(p: Point) {
    if (!this.hitArea) {
      return false
    }

    return this.hitArea.contains(p)
  }

  /**
   * 构建自身的batch
   */
  public buildBatches(batchRenderer: BatchRenderer) {
    // nothing
  }

  /**
   * 更新自身的顶点坐标和透明度
   */
  public updateBatches(floatView: Float32Array, intView: Uint32Array): void {
    if (this.worldId !== this.transform.worldId) {
      this.worldId = this.transform.worldId

      for (let i = 0; i < this.batchCount; i++) {
        this.batches[i].updateVertices(floatView)
      }
    }

    if (this.alphaDirty) {
      this.alphaDirty = false

      for (let i = 0; i < this.batchCount; i++) {
        this.batches[i].updateAlpha(intView)
      }
    }
  }
}

import { DisplayObject } from './DisplayObject'
import { Transform } from '@/math'
import { CanvasRenderer } from '@/renderer/CanvasRenderer'

export class Container extends DisplayObject {
  public sortDirty = false
  public readonly children: Container[] = []

  constructor() {
    super()
  }

  /**
   * 渲染自身，在container上面没有东西要渲染，所以这个函数的内容为空
   */
  protected renderCanvas(render: CanvasRenderer) {
    // nothing
  }

  /**
   * 递归渲染以自身为根的整棵节点树
   */
  public renderCanvasRecursive(render: CanvasRenderer) {
    if (!this.visible) {
      return
    }

    this.renderCanvas(render)

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      child.renderCanvasRecursive(render)
    }
  }

  /**
   * 递归更新当前元素以及所有子元素的transform
   */
  public updateTransform() {
    this.sortChildren()

    const parentTransform = this.parent?.transform || new Transform()
    const hasWorldTransformChanged =
      this.transform.updateTransform(parentTransform)

    this.worldAlpha = (this.parent?.worldAlpha || 1) * this.alpha

    if (this.worldAlpha <= 0 || !this.visible) {
      return
    }

    for (let i = 0, j = this.children.length; i < j; ++i) {
      const child = this.children[i]

      // 若当前元素的worldTransform改变了，那么其子元素的worldTransform需要重新计算
      if (hasWorldTransformChanged) {
        child.transform.shouldUpdateWorldTransform = true
      }

      child.updateTransform()
    }
  }

  public addChild(child: Container) {
    child.parent?.removeChild(child) // 将要添加的child从它的父元素的children中移除

    this.children.push(child)
    child.parent = this // 将要添加的child的parent指向this
    this.sortDirty = true
  }
  public removeChild(child: Container) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1)
        child.parent = null
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
}

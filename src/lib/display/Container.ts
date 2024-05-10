import { DisplayObject } from './DisplayObject'
import { Point, Transform } from '@/math'
import { CanvasRenderer } from '@/renderer/CanvasRenderer'
import { WebGLRenderer } from '@/renderer/WebGLRenderer'

export class Container extends DisplayObject {
  public sortDirty = false
  public readonly children: Container[] = []

  constructor() {
    super()
  }

  /**
   * 使用canvas2D，渲染自身，在container上面没有东西要渲染，所以这个函数的内容为空
   */
  protected renderCanvas(renderer: CanvasRenderer) {
    // nothing
  }

  /**
   * 使用webGL，渲染自身，在container上面没有东西要渲染，所以这个函数的内容为空
   */
  protected renderWebGL(renderer: WebGLRenderer) {
    // nothing
  }

  /**
   * 使用canvas2D，递归渲染以自身为根的整棵节点树
   */
  public renderCanvasRecursive(renderer: CanvasRenderer) {
    // 如果visible为false，那么自身以及自身的所有子节点都不用渲染
    if (!this.visible) {
      return
    }

    this.renderCanvas(renderer)

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].renderCanvasRecursive(renderer)
    }
  }

  /**
   * 使用webGL，递归渲染以自身为根的整棵节点树
   */
  public renderWebGLRecursive(renderer: WebGLRenderer) {
    if (!this.visible) {
      return
    }

    this.renderWebGL(renderer)

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].renderWebGLRecursive(renderer)
    }
  }

  /**
   * 递归更新当前元素以及所有子元素的transform
   */
  public updateTransform() {
    this.sortChildren()

    const parentTransform = this.parent?.transform || new Transform()
    this.transform.updateTransform(parentTransform)

    this.worldAlpha = (this.parent?.worldAlpha ?? 1) * this.alpha

    if (this.worldAlpha <= 0 || !this.visible) {
      return
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateTransform()
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
  public containsPoint(p: Point) {
    if (!this.hitArea) {
      return false
    }

    return this.hitArea.contains(p)
  }
}

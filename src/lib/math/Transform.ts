import { Matrix } from './Matrix'
import { ObservablePoint } from './Point'

export class Transform {
  public localTransform = new Matrix()
  public worldTransform = new Matrix()
  public position: ObservablePoint
  public scale: ObservablePoint
  public pivot: ObservablePoint
  public skew: ObservablePoint
  public _rotation = 0
  private rotateMatrix = new Matrix()
  private skewMatrix = new Matrix()
  private scaleMatrix = new Matrix()
  private localMatrix = new Matrix() // 不包含平移的localTransform

  public shouldUpdateLocalTransform = false
  public worldId = 0
  private parentId = 0

  constructor() {
    this.position = new ObservablePoint(this.onChange)
    this.scale = new ObservablePoint(this.onScaleChange, 1, 1)
    this.pivot = new ObservablePoint(this.onChange)
    this.skew = new ObservablePoint(this.onSkewChange)
  }

  get rotation() {
    return this._rotation
  }

  set rotation(r: number) {
    this._rotation = r
    this.rotateMatrix.set(
      Math.cos(this.rotation),
      Math.sin(this.rotation),
      -Math.sin(this.rotation),
      Math.cos(this.rotation),
      0,
      0
    )

    this.shouldUpdateLocalTransform = true
  }

  private onSkewChange = (skewX: number, skewY: number) => {
    this.skewMatrix.set(
      Math.cos(skewY),
      Math.sin(skewY),
      Math.sin(skewX),
      Math.cos(skewX),
      0,
      0
    )

    this.shouldUpdateLocalTransform = true
  }

  private onScaleChange = (scaleX: number, scaleY: number) => {
    this.scaleMatrix.set(scaleX, 0, 0, scaleY, 0, 0)

    this.shouldUpdateLocalTransform = true
  }

  private onChange = () => {
    this.shouldUpdateLocalTransform = true
  }

  /**
   * 更新localTransform
   */
  public updateLocalTransform() {
    if (!this.shouldUpdateLocalTransform) {
      return
    }

    /**
     * 旋转，斜切(skew)，缩放不会影响矩阵第三列的值，我们先处理这3个操作
     * | cos(rotation)  -sin(rotation)  0 |   | cos(skewY)  sin(skewX)  0 |   | scaleX  0       0 |
     * | sin(rotation)  cos(rotation)   0 | x | sin(skewY)  cos(skewX)  0 | x | 0       scaleY  0 |
     * | 0              0               1 |   | 0           0           1 |   | 0       0       1 |
     */

    // 朴实无华的3个矩阵相乘
    const { a, b, c, d } = this.localMatrix
      .set(1, 0, 0, 1, 0, 0)
      .append(this.rotateMatrix)
      .append(this.skewMatrix)
      .append(this.scaleMatrix)

    /**
     * 接下来要处理平移操作了，因为要实现锚点，所以并不能简单地将平移的变换矩阵与上面那个矩阵相乘
     */
    // 首先计算出锚点在经历旋转，斜切(skew)，缩放后的新位置
    const newPivotX = a * this.pivot.x + c * this.pivot.y
    const newPivotY = b * this.pivot.x + d * this.pivot.y

    // 然后计算tx和ty
    const tx = this.position.x - newPivotX
    const ty = this.position.y - newPivotY

    this.localTransform.set(a, b, c, d, tx, ty)
    this.shouldUpdateLocalTransform = false

    // 更新了localTransform那么一定要更新worldTransform
    this.parentId = -1
  }

  public updateTransform(parentTransform: Transform) {
    this.updateLocalTransform()

    // 若当父元素的worldTransform改变了 or 当前元素的localTransform改变了，那么当前元素的worldTransform需要重新计算
    if (this.parentId !== parentTransform.worldId) {
      // 自身的localTransform左乘父元素的worldTransform就得到了自身的worldTransform

      const {
        a: a0,
        b: b0,
        c: c0,
        d: d0,
        tx: tx0,
        ty: ty0
      } = parentTransform.worldTransform
      const {
        a: a1,
        b: b1,
        c: c1,
        d: d1,
        tx: tx1,
        ty: ty1
      } = this.localTransform

      this.worldTransform.set(
        a0 * a1 + c0 * b1,
        b0 * a1 + d0 * b1,
        a0 * c1 + c0 * d1,
        b0 * c1 + d0 * d1,
        a0 * tx1 + c0 * ty1 + tx0,
        b0 * tx1 + d0 * ty1 + ty0
      )

      this.parentId = parentTransform.worldId

      this.worldId++
    }
  }
}

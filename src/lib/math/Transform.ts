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
  private transformMatrix: Matrix | null = null

  public shouldUpdateLocalTransform = false
  public shouldUpdateWorldTransform = false

  constructor() {
    this.position = new ObservablePoint(this.onChange)
    this.scale = new ObservablePoint(this.onChange, 1, 1)
    this.pivot = new ObservablePoint(this.onChange)
    this.skew = new ObservablePoint(this.onChange)
  }

  get rotation() {
    return this._rotation
  }

  set rotation(r: number) {
    this._rotation = r
    this.onChange()
  }

  private onChange = () => {
    this.shouldUpdateLocalTransform = true
  }

  /**
   * 更新localTransform
   */
  private updateLocalTransform() {
    if (!this.shouldUpdateLocalTransform) {
      return
    }

    if (this.transformMatrix) {
      this.localTransform = this.transformMatrix
      return
    }

    /**
     * 旋转，斜切(skew)，缩放不会影响矩阵第三列的值，我们先处理这3个操作
     * | cos(rotation)  -sin(rotation)  0 |   | cos(skewY)  sin(skewX)  0 |   | scaleX  0       0 |
     * | sin(rotation)  cos(rotation)   0 | x | sin(skewY)  cos(skewX)  0 | x | 0       scaleY  0 |
     * | 0              0               1 |   | 0           0           1 |   | 0       0       1 |
     */
    const rotateMatrix = new Matrix(
      Math.cos(this.rotation),
      Math.sin(this.rotation),
      -Math.sin(this.rotation),
      Math.cos(this.rotation)
    )
    const skewMatrix = new Matrix(
      Math.cos(this.skew.y),
      Math.sin(this.skew.y),
      Math.sin(this.skew.x),
      Math.cos(this.skew.x)
    )
    const scaleMatrix = new Matrix(this.scale.x, 0, 0, this.scale.y)

    // 朴实无华的3个矩阵相乘
    const { a, b, c, d } = rotateMatrix.append(skewMatrix).append(scaleMatrix)

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
    this.shouldUpdateWorldTransform = true
  }

  /**
   * @returns {boolean} true说明worldTransform发生了改变，false说明worldTransform没有发生改变
   */
  public updateTransform(parentTransform: Transform): boolean {
    this.updateLocalTransform()

    if (!this.shouldUpdateWorldTransform) {
      return false
    }

    // 自身的localTransform左乘父元素的worldTransform就得到了自身的worldTransform
    this.worldTransform = this.localTransform
      .clone()
      .prepend(parentTransform.worldTransform)

    this.shouldUpdateWorldTransform = false

    return true
  }

  public setFromMatrix(matrix: Matrix) {
    this.transformMatrix = matrix
    this.shouldUpdateLocalTransform = true
  }
}

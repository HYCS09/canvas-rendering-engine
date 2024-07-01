const defaultMaxLen = 2 ** 4 // 16

export class CustomFloatArray {
  private _oldLength = -1
  private _length = 0
  private curMaxLen = defaultMaxLen
  private float32 = new Float32Array(defaultMaxLen)
  private _data!: Float32Array

  /**
   * 获取长度
   */
  get length() {
    return this._length
  }

  /**
   * 拼接一个number数组
   */
  public concat(arr: number[]) {
    const newLen = this._length + arr.length

    while (newLen > this.curMaxLen) {
      this.expandCapacity()
    }

    for (let i = 0; i < arr.length; i++) {
      this.float32[this._length] = arr[i]
      this._length++
    }
  }

  /**
   * 插入数据
   * @param num 要插入的数
   */
  public push(num: number) {
    if (this._length >= this.curMaxLen) {
      this.expandCapacity()
    }

    this.float32[this._length] = num
    this._length++
  }

  /**
   * 扩容
   */
  public expandCapacity() {
    this.curMaxLen *= 2

    const newFloat32 = new Float32Array(this.curMaxLen)
    newFloat32.set(this.float32)
    this.float32 = newFloat32
  }

  /**
   * 以从0到this.length的这段buffer为底层，建立Float32Array视图并返回
   */
  get data() {
    if (this._oldLength !== this._length) {
      this._data = new Float32Array(this.float32.buffer, 0, this._length)
      this._oldLength = this._length
    }
    return this._data
  }

  /**
   * 清空
   */
  public clear() {
    // 并不会真的清空
    this._length = 0
  }
}

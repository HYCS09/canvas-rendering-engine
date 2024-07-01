const defaultMaxLen = 2 ** 3 // 8

export class CustomIntArray {
  private _oldLength = -1
  private _length = 0
  private curMaxLen = defaultMaxLen
  private int32 = new Uint32Array(defaultMaxLen)
  private _data!: Uint32Array

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
    const newLen = this.length + arr.length

    while (newLen > this.curMaxLen) {
      this.expandCapacity()
    }

    for (let i = 0; i < arr.length; i++) {
      this.int32[this._length] = arr[i]
      this._length++
    }
  }

  /**
   * 拼接一个UInt16数组
   */
  public concatUInt16(uint16: Uint32Array) {
    const newLen = this.length + uint16.length

    while (newLen > this.curMaxLen) {
      this.expandCapacity()
    }

    this.int32.set(uint16, this._length)

    this._length = newLen
  }

  /**
   * 扩容
   */
  public expandCapacity() {
    this.curMaxLen *= 2

    const newUInt16 = new Uint32Array(this.curMaxLen)
    newUInt16.set(this.int32)
    this.int32 = newUInt16
  }

  /**
   * 以从0到this.length的这段buffer为底层，建立Uint32Array视图并返回
   */
  get data() {
    if (this._oldLength !== this._length) {
      this._data = new Uint32Array(this.int32.buffer, 0, this._length)
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

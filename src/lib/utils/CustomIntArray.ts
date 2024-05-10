const defaultMaxLen = 2 ** 3 // 8

export class CustomIntArray {
  private cursor = 0
  private curMaxLen = defaultMaxLen
  private int16 = new Uint16Array(defaultMaxLen)

  constructor() {}

  /**
   * 获取长度
   */
  get length() {
    return this.cursor
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
      this.int16[this.cursor] = arr[i]
      this.cursor++
    }
  }

  /**
   * 拼接一个UInt16数组
   */
  public concatUInt16(uint16: Uint16Array) {
    const newLen = this.length + uint16.length

    while (newLen > this.curMaxLen) {
      this.expandCapacity()
    }

    this.int16.set(uint16, this.cursor)

    this.cursor = newLen
  }

  /**
   * 扩容
   */
  public expandCapacity() {
    this.curMaxLen *= 2

    const newUInt16 = new Uint16Array(this.curMaxLen)
    newUInt16.set(this.int16)
    this.int16 = newUInt16
  }

  /**
   * 以从0到this.length的这段buffer为底层，建立Uint16Array视图并返回
   */
  get data() {
    return new Uint16Array(this.int16.buffer, 0, this.length)
  }

  /**
   * 清空
   */
  public clear() {
    // 并不会真的清空
    this.cursor = 0
  }
}

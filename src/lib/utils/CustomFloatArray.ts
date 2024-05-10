const defaultMaxLen = 2 ** 4 // 16

export class CustomFloatArray {
  private cursor = 0
  private curMaxLen = defaultMaxLen
  private float32 = new Float32Array(defaultMaxLen)

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
      this.float32[this.cursor] = arr[i]
      this.cursor++
    }
  }

  /**
   * 插入数据
   * @param num 要插入的数
   */
  public push(num: number) {
    if (this.cursor >= this.curMaxLen) {
      this.expandCapacity()
    }

    this.float32[this.cursor] = num
    this.cursor++
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
    return new Float32Array(this.float32.buffer, 0, this.length)
  }

  /**
   * 清空
   */
  public clear() {
    // 并不会真的清空
    this.cursor = 0
  }
}

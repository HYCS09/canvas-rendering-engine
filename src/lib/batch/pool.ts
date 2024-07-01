import { Batch } from './batch'

export abstract class BatchPool {
  protected idx = 0
  public abstract getOne(): Batch
  reset() {
    this.idx = 0
  }
}

import { BatchPool } from '@/batch'
import { SpriteBatch } from './SpriteBatch'

export class SpriteBatchPool extends BatchPool {
  private batches: SpriteBatch[] = []
  constructor() {
    super()
  }
  public getOne() {
    if (!this.batches[this.idx]) {
      this.batches[this.idx] = new SpriteBatch()
    }
    return this.batches[this.idx++]
  }
}

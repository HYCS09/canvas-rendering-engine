import { BatchPool } from '@/batch'
import { GraphicsBatch } from '../GraphicsBatch'

export class GraphicsBatchPool extends BatchPool {
  private batches: GraphicsBatch[] = []
  constructor() {
    super()
  }
  public getOne() {
    if (!this.batches[this.idx]) {
      this.batches[this.idx] = new GraphicsBatch()
    }
    return this.batches[this.idx++]
  }
}

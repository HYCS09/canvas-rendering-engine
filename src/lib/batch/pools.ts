import { GraphicsBatchPool } from '@/graphics/utils/pool'
import { BatchPool } from './pool'

class BatchPools {
  private batchesMap: Record<string, BatchPool> = {
    graphics: new GraphicsBatchPool()
  }
  constructor() {}
  public get(type: string) {
    return this.batchesMap[type].getOne()
  }
  public reset() {
    Object.values(this.batchesMap).forEach((pool) => {
      pool.reset()
    })
  }
}

export const batchPool = new BatchPools()

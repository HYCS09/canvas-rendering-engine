import { GraphicsBatchPool } from '@/graphics/utils/graphicBatchPool'
import { BatchPool } from './pool'
import { SpriteBatchPool } from '@/sprite/SpriteBatchPool'

class BatchPools {
  private batchesMap: Record<string, BatchPool> = {
    graphics: new GraphicsBatchPool(),
    sprite: new SpriteBatchPool()
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

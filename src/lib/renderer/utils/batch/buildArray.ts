import { Container } from '@/display'
import { BatchRenderer } from '@/renderer/BatchRenderer'

/**
 * 构建大数组
 */
export const buildArray = (
  batchRenderer: BatchRenderer,
  container: Container
) => {
  if (!container.visible) {
    return
  }

  container.buildBatches(batchRenderer)

  const children = container.children

  for (let i = 0; i < children.length; i++) {
    buildArray(batchRenderer, children[i])
  }
}

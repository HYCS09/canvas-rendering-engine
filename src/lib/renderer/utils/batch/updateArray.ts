import { Container } from '@/display'

/**
 * 更新大数组
 */
export const updateArray = (
  floatView: Float32Array,
  intView: Uint32Array,
  container: Container
) => {
  if (!container.visible) {
    return
  }

  container.updateBatches(floatView, intView)

  const children = container.children

  for (let i = 0; i < children.length; i++) {
    updateArray(floatView, intView, children[i])
  }
}

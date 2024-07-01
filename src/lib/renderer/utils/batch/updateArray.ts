import { Container } from '@/display'

/**
 * 更新大数组
 */
export const updateArray = (floatView: Float32Array, container: Container) => {
  if (container.worldAlpha <= 0 || !container.visible) {
    return
  }

  container.updateBatches(floatView)

  const children = container.children

  for (let i = 0; i < children.length; i++) {
    updateArray(floatView, children[i])
  }
}

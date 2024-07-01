import { Renderer } from './renderer/Renderer'
import { IApplicationOptions } from '@/types'
import { normalizeColor } from './graphics/style/utils'

const supportWebGPU = () => {
  return !!navigator.gpu
}

export const getRenderer = async (
  options: IApplicationOptions
): Promise<Renderer> => {
  const { prefer = 'webGPU' } = options

  let realPrefer = prefer

  if (realPrefer === 'webGPU') {
    // webGPU的兼容性目前不是很好，所以针对它写一个判断逻辑
    if (supportWebGPU()) {
      const { WebGPURenderer } = await import('./renderer/WebGPURenderer')
      return new WebGPURenderer(options)
    }

    realPrefer = 'webGL'
  }

  if (realPrefer === 'webGL') {
    const { WebGLRenderer } = await import('./renderer/WebGLRenderer')
    return new WebGLRenderer(options)
  }

  if (realPrefer === 'canvas2D') {
    const { CanvasRenderer } = await import('./renderer/CanvasRenderer')
    return new CanvasRenderer(options)
  }

  throw new Error(`不存在${realPrefer} renderer`)
}

export const normalizeOptions = (options: IApplicationOptions) => {
  const { backgroundColor, backgroundAlpha } = options

  if (backgroundColor === undefined) {
    options.backgroundColor = '#000000'
  }

  if (backgroundAlpha === undefined) {
    options.backgroundAlpha = 0
  }

  if (backgroundColor) {
    options.backgroundColor = normalizeColor(backgroundColor)
  }

  if (backgroundAlpha) {
    if (backgroundAlpha < 0) {
      options.backgroundAlpha = 0
    }

    if (backgroundAlpha > 1) {
      options.backgroundAlpha = 1
    }
  }
}

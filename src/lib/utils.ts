import { Renderer } from './renderer/Renderer'
import { IApplicationOptions } from '@/types'
import { CanvasRenderer } from './renderer/CanvasRenderer'
import { WebGLRenderer } from './renderer/WebGLRenderer'
import { WebGPURenderer } from './renderer/WebGPURenderer'
import { normalizeColor } from './graphics/style/utils'

export const getRenderer = (options: IApplicationOptions): Renderer => {
  const { prefer = 'webGL' } = options
  switch (prefer) {
    case 'canvas2D':
      return new CanvasRenderer(options)
    case 'webGL':
      return new WebGLRenderer(options)
    case 'webGPU':
      return new WebGPURenderer(options)
    default:
      throw new Error(`不存在${prefer} renderer`)
  }
}

export const normalizeOptions = (options: IApplicationOptions) => {
  const { backgroundColor, backgroundAlpha } = options

  if (backgroundColor === undefined) {
    options.backgroundColor = '#ffffff'
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

import { Renderer } from './renderer/Renderer'
import { RendererType } from './enums'
import { IApplicationOptions } from '@/types'
import { CanvasRenderer } from './renderer/CanvasRenderer'
import { WebGlRenderer } from './renderer/WebGlRenderer'

export const getRenderer = (options: IApplicationOptions): Renderer => {
  const { rendererType: renderType } = options
  switch (renderType) {
    case RendererType.Canvas:
      return new CanvasRenderer(options)
    case RendererType.WebGl:
      return new WebGlRenderer(options)
    default:
      return new CanvasRenderer(options)
  }
}

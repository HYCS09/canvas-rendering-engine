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

export const randomHexCreator = () => {
  const candidates = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f'
  ]
  let resStr = '#'
  for (let i = 0; i < 6; i++) {
    const randomNum = Math.floor(Math.random() * 16)
    resStr += candidates[randomNum]
  }
  return resStr
}

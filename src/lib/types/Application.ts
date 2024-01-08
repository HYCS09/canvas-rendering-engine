import { RendererType } from '@/enums'

export interface IApplicationOptions {
  rendererType?: RendererType // 这里留个坑，未来可能会实现webgl render
  view: HTMLCanvasElement
  backgroundColor?: string
}

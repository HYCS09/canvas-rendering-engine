export interface IApplicationOptions {
  prefer?: 'canvas2D' | 'webGL' | 'webGPU' // 优先使用哪种renderer
  view: HTMLCanvasElement
  backgroundColor?: string | number
  backgroundAlpha?: number
}

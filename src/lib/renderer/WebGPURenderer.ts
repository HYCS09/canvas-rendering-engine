import { Container } from '@/display'
import { IApplicationOptions } from '@/types'
import { Renderer } from './Renderer'

export class WebGPURenderer extends Renderer {
  constructor(options: IApplicationOptions) {
    console.log(
      '正在使用 %c webGPU ',
      'color: #0072c6; background-color: #ffffff;font-size: 20px;',
      '渲染'
    )

    super(options)
  }
  public render(container: Container): void {
    // todo
  }
}

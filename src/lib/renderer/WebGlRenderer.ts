import { Container } from '@/display'
import { IApplicationOptions } from '@/types'
import { Renderer } from './Renderer'

export class WebGlRenderer extends Renderer {
  constructor(options: IApplicationOptions) {
    super(options)
  }
  public render(container: Container): void {
    // todo
  }
}

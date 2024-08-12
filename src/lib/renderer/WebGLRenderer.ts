import { IApplicationOptions } from '@/types'
import { initShader } from './utils/webgl/initShader'
import { toRgbArray } from '@/utils/color'
import { BatchRenderer } from './BatchRenderer'
import { GlTextureSystem } from '@/texture/GlTextureSystem'

export class WebGLRenderer extends BatchRenderer {
  public gl: WebGLRenderingContext

  private program: WebGLProgram
  private unifLoc: {
    u_root_transform: WebGLUniformLocation
    u_projection_matrix: WebGLUniformLocation
  }
  private textureSystem: GlTextureSystem

  constructor(options: IApplicationOptions) {
    console.log(
      '正在使用 %c webGL ',
      'color: #881910; background-color: #ffffff;font-size: 20px;',
      '渲染'
    )

    super(options)

    const opts: WebGLContextAttributes = {
      antialias: true
    }
    const gl = this.canvasEle.getContext('webgl', opts) as WebGLRenderingContext
    this.textureSystem = new GlTextureSystem(gl)

    this.gl = gl

    this.program = initShader(this)

    const uRootTransformLoc = gl.getUniformLocation(
      this.program,
      'u_root_transform'
    ) as WebGLUniformLocation
    const uProjectionMatrixLoc = gl.getUniformLocation(
      this.program,
      'u_projection_matrix'
    ) as WebGLUniformLocation
    this.unifLoc = {
      u_root_transform: uRootTransformLoc,
      u_projection_matrix: uProjectionMatrixLoc
    }

    this.setProjectionMatrix()

    const { backgroundColor, backgroundAlpha } = options
    const a = backgroundAlpha as number
    const [r, g, b] = toRgbArray(backgroundColor as string)
    gl.clearColor(r * a, g * a, b * a, a)

    this.setRootTransform(1, 0, 0, 1, 0, 0)

    gl.getExtension('OES_element_index_uint')

    gl.bufferData(gl.ARRAY_BUFFER, this.vertFloatView, gl.STATIC_DRAW)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer, gl.STATIC_DRAW)
  }

  protected setProjectionMatrix() {
    const width = this.canvasEle.width
    const height = this.canvasEle.height

    const gl = this.gl

    const loc = this.unifLoc.u_projection_matrix

    const scaleX = (1 / width) * 2
    const scaleY = (1 / height) * 2

    gl.uniformMatrix3fv(
      loc,
      false,
      new Float32Array([scaleX, 0, 0, 0, -scaleY, 0, -1, 1, 1])
    )
  }

  setRootTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
  ) {
    const gl = this.gl

    const loc = this.unifLoc.u_root_transform

    gl.uniformMatrix3fv(
      loc,
      false,
      new Float32Array([a, b, 0, c, d, 0, tx, ty, 1])
    )
  }

  draw(): void {
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT)

    for (let i = 0; i < this.drawCallCount; i++) {
      const { start, size, texCount, baseTextures } = this.drawCalls[i]

      for (let j = 0; j < texCount; j++) {
        this.textureSystem.bind(baseTextures[j], j)
      }

      gl.drawElements(
        gl.TRIANGLES,
        size,
        gl.UNSIGNED_INT,
        start * Uint32Array.BYTES_PER_ELEMENT
      )
    }
  }

  updateBuffer(): void {
    const gl = this.gl

    if (this.vertexCount > this.curVertBufferLength) {
      gl.bufferData(gl.ARRAY_BUFFER, this.vertFloatView, gl.STATIC_DRAW)

      this.curVertBufferLength = this.vertexCount
    } else {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertFloatView)
    }

    if (this.indexCount > this.curIndexBufferLength) {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer, gl.STATIC_DRAW)
      this.curIndexBufferLength = this.indexCount
    } else {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, this.indexBuffer)
    }
  }
}

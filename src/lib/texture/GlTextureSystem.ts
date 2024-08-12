import { BaseTexture } from './BaseTexture'

export class GlTextureSystem {
  private gl: WebGLRenderingContext
  private activeLocation = 0
  private bindedTextures: Array<BaseTexture | null> = []

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
  }

  /**
   * 激活某个binding point
   */
  private activateLocation(location: number) {
    const gl = this.gl

    if (this.activeLocation === location) {
      return
    }

    this.activeLocation = location
    gl.activeTexture(gl.TEXTURE0 + location)
  }

  /**
   * 将某个base texture绑定到对应的binding point
   */
  public bind(baseTexture: BaseTexture, location: number) {
    if (this.bindedTextures[location] === baseTexture) {
      return
    }

    const gl = this.gl

    this.activateLocation(location)

    if (baseTexture.glTexture) {
      gl.bindTexture(gl.TEXTURE_2D, baseTexture.glTexture)
    } else {
      baseTexture.glTexture = gl.createTexture() as WebGLTexture
      gl.bindTexture(gl.TEXTURE_2D, baseTexture.glTexture)
      baseTexture.glUpload(gl)
    }

    this.bindedTextures[location] = baseTexture
  }
}

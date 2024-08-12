import { uniqueId } from 'lodash-es'
import { isPowerOfTwo, validateSource } from './utils'
import { SAMPLE_COUNT } from '@/constants'

const baseTextureCache: Record<string, BaseTexture> = {}

export type BaseTextureSource = HTMLImageElement | HTMLCanvasElement

export class BaseTexture {
  /**
   * 独一无二的id
   */
  public uid = uniqueId('base-texture-uid-')

  /**
   * 对应的资源的宽度
   */
  public width = 0

  /**
   * 对应的资源的高度
   */
  public height = 0

  /**
   * 属于哪个draw call
   */
  public drawCallTick = -1

  /**
   * BaseTexture来源，可以是图片或者canvas元素
   */
  public source: HTMLImageElement | HTMLCanvasElement

  /**
   * 长宽是否都是2的n次方
   */
  public isPowerOfTwo = false

  /**
   * 纹理的gpu location，为0-16的int型数字
   */
  public gpuLocation = -1

  /**
   * WebGL的texture
   */
  public glTexture?: WebGLTexture

  /**
   * WebGPU的texture
   */
  public gpuTexture?: GPUTexture

  constructor(source: BaseTextureSource) {
    validateSource(source)

    if (source instanceof HTMLImageElement) {
      this.handleImgLoaded(source)
    } else if (source instanceof HTMLCanvasElement) {
      this.handleCanvasLoaded(source)
    }

    this.source = source
  }

  /**
   * 将资源上传到GPU中(WebGL模式会使用这个函数)
   */
  public glUpload(gl: WebGLRenderingContext) {
    if (!this.glTexture) {
      this.glTexture = gl.createTexture() as WebGLTexture
    }

    gl.bindTexture(gl.TEXTURE_2D, this.glTexture)

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.source
    )

    if (this.isPowerOfTwo) {
      gl.generateMipmap(gl.TEXTURE_2D)

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      )

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  }

  /**
   * 生成WebGPU Texture
   */
  public createGpuTexture(device: GPUDevice) {
    this.gpuTexture = device.createTexture({
      label: `my-gpu-texture-${this.uid}`,
      size: {
        width: this.width,
        height: this.height
      },
      format: 'bgra8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
      sampleCount: SAMPLE_COUNT
    })
  }

  /**
   * 将资源上传到GPU中(WebGPU模式会使用这个函数)
   */
  public gpuUpload(device: GPUDevice) {
    let canvas: HTMLCanvasElement
    if (this.source instanceof HTMLImageElement) {
      canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.drawImage(this.source, 0, 0)
    } else {
      canvas = this.source
    }

    device.queue.copyExternalImageToTexture(
      { source: canvas },
      {
        texture: this.gpuTexture as GPUTexture,
        premultipliedAlpha: true
      },
      { width: this.width, height: this.height }
    )
  }

  private handleImgLoaded(img: HTMLImageElement) {
    this.width = img.naturalWidth
    this.height = img.naturalHeight

    this.isPowerOfTwo = isPowerOfTwo(this.width) && isPowerOfTwo(this.height)
  }

  private handleCanvasLoaded(canvas: HTMLCanvasElement) {
    this.width = canvas.width
    this.height = canvas.height

    this.isPowerOfTwo = isPowerOfTwo(this.width) && isPowerOfTwo(this.height)
  }

  /**
   * 推荐用这个函数来创建BaseTexture，这种方式会走缓存，避免重复创建相同的BaseTexture
   */
  static from(source: BaseTextureSource) {
    validateSource(source)

    const mySource = source as any

    if (!mySource._baseTextureId) {
      mySource._baseTextureId = uniqueId('base-texture')
    }

    const cacheId = mySource._baseTextureId

    if (!baseTextureCache[cacheId]) {
      baseTextureCache[cacheId] = new BaseTexture(source)
    }

    return baseTextureCache[cacheId]
  }
}

import { BaseTextureSource } from './BaseTexture'

export const isPowerOfTwo = (num: number) => {
  let i = 1

  while (i <= num) {
    if (i === num) {
      return true
    } else {
      i *= 2
    }
  }

  return false
}

export const EMPTY = document.createElement('canvas')
EMPTY.width = 16
EMPTY.height = 16
const ctx = EMPTY.getContext('2d') as CanvasRenderingContext2D
ctx.fillStyle = '#ffffffff'
ctx.fillRect(0, 0, 16, 16)

/**
 * 格式校验
 */
export const validateSource = (source: BaseTextureSource) => {
  if (
    !(source instanceof HTMLImageElement || source instanceof HTMLCanvasElement)
  ) {
    throw new Error(`资源类型必须为HTMLImageElement或HTMLCanvasElement!`)
  } else {
    if (source instanceof HTMLImageElement) {
      if (!source.complete) {
        throw new Error(`图片类型的资源未加载完毕`)
      }

      if (source.naturalWidth === 0 || source.naturalHeight === 0) {
        throw new Error(`资源的宽度和高度均不能为0`)
      }
    } else {
      if (source.width === 0 || source.height === 0) {
        throw new Error(`资源的宽度和高度均不能为0`)
      }
    }
  }
}

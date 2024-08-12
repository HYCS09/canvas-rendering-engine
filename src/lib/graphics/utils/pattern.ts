import { Texture } from '@/texture'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

export const getCanvasPattern = (texture: Texture) => {
  const { crop, baseTexture } = texture

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.save()

  ctx.clearRect(0, 0, crop.width, crop.height)

  ctx.drawImage(
    baseTexture.source,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  ctx.restore()

  texture.canvasPattern = ctx.createPattern(
    canvas,
    'no-repeat'
  ) as CanvasPattern

  return texture.canvasPattern
}

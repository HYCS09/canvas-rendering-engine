import { Circle, Ellipse, Polygon, Rectangle, RoundedRectangle } from '@/math'
import { GraphicsData } from '../GraphicsData'

const buildCircleVertices = (circle: Circle, data: GraphicsData) => {
  const { x, y, radius } = circle
  const len = 2 * Math.PI * radius
  const segmentCount = Math.min(Math.ceil(len / 5), 2048)

  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 2
    const pX = x + radius * Math.cos(angle)
    const pY = y + radius * Math.sin(angle)
    data.vertices.push(pX, pY)
  }
}

const buildRoundedRectangleVertices = (
  roundedRectangle: RoundedRectangle,
  data: GraphicsData
) => {
  const { x, y, width, height, radius } = roundedRectangle

  // 分4段来求
  const len = (2 * Math.PI * radius) / 4
  const segmentCount = Math.min(Math.ceil(len / 4), 2048)

  // 第一段圆弧(圆角矩形的右下角)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5

    const pX = radius * Math.cos(angle)
    const pY = radius * Math.sin(angle)

    data.vertices.push(x + width - radius + pX, y + height - radius + pY)
  }

  // 第二段圆弧(圆角矩形的左下角)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5 + Math.PI / 2

    const pX = radius * Math.cos(angle)
    const pY = radius * Math.sin(angle)

    data.vertices.push(x + radius + pX, y + height - radius + pY)
  }

  // 第三段圆弧(圆角矩形的左上角)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5 + Math.PI

    const pX = radius * Math.cos(angle)
    const pY = radius * Math.sin(angle)

    data.vertices.push(x + radius + pX, y + radius + pY)
  }

  // 第四段圆弧(圆角矩形的右上角)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5 + Math.PI * 1.5

    const pX = radius * Math.cos(angle)
    const pY = radius * Math.sin(angle)

    data.vertices.push(x + width - radius + pX, y + radius + pY)
  }
}

const buildEllipseVertices = (ellipse: Ellipse, data: GraphicsData) => {
  const { x, y, radiusX, radiusY } = ellipse

  const len = Math.PI * Math.sqrt(2 * (radiusX * radiusX + radiusY * radiusY))
  const segmentCount = Math.min(Math.ceil(len / 5), 2048)

  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 2
    const pX = x + radiusX * Math.cos(angle)
    const pY = y + radiusY * Math.sin(angle)
    data.vertices.push(pX, pY)
  }
}

/**
 * 将一个图形顶点化
 * @param data 子图形data
 */
export const buildVertices = (data: GraphicsData) => {
  const { shape, vertices } = data
  if (shape instanceof Rectangle) {
    const { x, y, width, height } = shape
    vertices.push(x, y, x + width, y, x + width, y + height, x, y + height)
  }

  if (shape instanceof Circle) {
    buildCircleVertices(shape, data)
  }

  if (shape instanceof RoundedRectangle) {
    buildRoundedRectangleVertices(shape, data)
  }

  if (shape instanceof Ellipse) {
    buildEllipseVertices(shape, data)
  }

  if (shape instanceof Polygon) {
    // 多边形本身就是一系列的顶点
    data.vertices = shape.points
  }
}

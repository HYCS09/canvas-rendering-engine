import { Circle, Ellipse, Polygon, Rectangle, RoundedRectangle } from '@/math'
import { GraphicsGeometry } from '../GraphicsGeometry'
import { GraphicsData } from '../GraphicsData'
import { BatchPart } from './BatchPart'
import earcut from 'earcut'

const triangulateCircleFill = (vertices: number[]) => {
  const indices: number[] = []

  // 之前把中心点push到了顶点数组，所以顶点的个数要+1
  const len = vertices.length / 2 + 1

  for (let i = 1; i < len - 1; i++) {
    indices.push(0, i, i + 1)
  }

  // 还有最后一块
  indices.push(0, len - 1, 1)

  return indices
}

export const triangulateFill = (
  data: GraphicsData,
  geometry: GraphicsGeometry
) => {
  const { shape, vertices, fillStyle } = data

  const batchPart = new BatchPart(fillStyle)
  geometry.batchParts.push(batchPart)

  batchPart.start(geometry.vertices.length / 2, geometry.vertexIndices.length)

  if (shape instanceof Rectangle) {
    geometry.vertices.concat(vertices)
    geometry.vertexIndices.concat([0, 1, 2, 0, 2, 3])

    // 矩形的顶点是固定的4个，顶点下标则是固定的6个
    batchPart.end(4, 6)
  }

  if (shape instanceof Circle) {
    const { x, y } = shape

    // 先将圆心push进去
    geometry.vertices.push(x)
    geometry.vertices.push(y)

    geometry.vertices.concat(vertices)

    const indices = triangulateCircleFill(vertices)
    geometry.vertexIndices.concat(indices)

    batchPart.end(vertices.length / 2 + 1, indices.length)
  }

  if (shape instanceof RoundedRectangle) {
    const { x, y, width, height } = shape

    // 先将中心点push进去
    geometry.vertices.push(x + width / 2)
    geometry.vertices.push(y + height / 2)

    geometry.vertices.concat(vertices)

    const indices = triangulateCircleFill(vertices)
    geometry.vertexIndices.concat(indices)

    batchPart.end(vertices.length / 2 + 1, indices.length)
  }

  if (shape instanceof Ellipse) {
    const { x, y } = shape

    // 先将椭圆中心点push进去
    geometry.vertices.push(x)
    geometry.vertices.push(y)

    geometry.vertices.concat(vertices)

    const indices = triangulateCircleFill(vertices)
    geometry.vertexIndices.concat(indices)

    batchPart.end(vertices.length / 2 + 1, indices.length)
  }

  if (shape instanceof Polygon) {
    geometry.vertices.concat(vertices)

    const indices = earcut(vertices)
    geometry.vertexIndices.concat(indices)

    batchPart.end(vertices.length / 2, indices.length)
  }
}

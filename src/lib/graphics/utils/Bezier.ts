export const getBezierLength = (
  P0X: number,
  P0Y: number,
  P1X: number,
  P1Y: number,
  P2X: number,
  P2Y: number,
  P3X: number,
  P3Y: number
) => {
  const n = 10 // 取10段

  let x = P0X
  let y = P0Y

  let length = 0

  for (let i = 1; i <= n; i++) {
    const t = i / n

    const newX =
      (1 - t) * (1 - t) * (1 - t) * P0X +
      3 * t * (1 - t) * (1 - t) * P1X +
      3 * t * t * (1 - t) * P2X +
      t * t * t * P3X
    const newY =
      (1 - t) * (1 - t) * (1 - t) * P0Y +
      3 * t * (1 - t) * (1 - t) * P1Y +
      3 * t * t * (1 - t) * P2Y +
      t * t * t * P3Y

    const dx = newX - x
    const dy = newY - y

    length += Math.sqrt(dx * dx + dy * dy)

    x = newX
    y = newY
  }

  return length
}

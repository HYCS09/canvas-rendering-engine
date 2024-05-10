import { colorMap } from './colorMap'

const reg = /^#[0-9a-f]{6}$/i
export const normalizeColor = (color: string | number) => {
  if (typeof color === 'number') {
    const realColor = color & 0xffffff
    let res = realColor.toString(16)

    res = '0'.repeat(6 - res.length) + res

    return `#${res}`
  } else {
    const lowerCase = color.toLowerCase()
    if (colorMap[lowerCase]) {
      return colorMap[lowerCase]
    }

    if (reg.test(color)) {
      return color
    } else {
      throw new Error(`颜色${color}不合法`)
    }
  }
}

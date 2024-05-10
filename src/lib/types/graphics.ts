import { LINE_CAP, LINE_JOIN } from '@/enums'

export interface IFillStyleOptions {
  color?: string | number
  alpha?: number
  visible?: boolean
}

export interface ILineStyleOptions extends IFillStyleOptions {
  width?: number
  cap?: LINE_CAP
  join?: LINE_JOIN
  miterLimit?: number
}

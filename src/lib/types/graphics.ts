import { LineCap, LineJoin } from '@/enums'

export interface IFillStyleOptions {
  color?: string
  alpha?: number
  visible?: boolean
}

export interface ILineStyleOptions extends IFillStyleOptions {
  width?: number
  cap?: LineCap
  join?: LineJoin
}

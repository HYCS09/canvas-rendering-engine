import { useEffect, useRef } from 'react'
import './App.css'
import {
  Application,
  Graphics,
  Container,
  RendererType,
  Rectangle
} from './lib'
import { drawAuxiliaryLine } from './utils'
import { message } from 'antd'

const width = 1200
const height = 700

// (200, 200, 100, Math.PI * 8.4, Math.PI * 6.5) OK
// (200, 200, 100, Math.PI * 2, Math.PI * 6.5) OK
// (200, 200, 100, Math.PI * 0.5, Math.PI * 6.4) OK
// (200, 200, 100, Math.PI * -0.5, Math.PI * 6.4) OK
// (200, 200, 100, Math.PI * 1, Math.PI * 2.5) OK
// (200, 200, 100, Math.PI * 5.5, Math.PI * 2.5) OK

// (200, 200, 100, Math.PI * 5.5, Math.PI * 2.5, true) OK
// (200, 200, 100, Math.PI * 3.5, Math.PI * 2.5, true) OK
// (200, 200, 100, Math.PI * 2, Math.PI * 9.8, true) OK
// (200, 200, 100, Math.PI * 1.3, Math.PI * -0.5, true) OK
// (200, 200, 100, Math.PI * 2.5, Math.PI * -0.5, true) OK
// (200, 200, 100, Math.PI * -5.6, Math.PI * 2.5, true) OK

function App() {
  const appRef = useRef<Application>()
  useEffect(() => {
    const view = document.getElementById('canvas') as HTMLCanvasElement
    appRef.current = new Application({
      rendererType: RendererType.Canvas,
      view,
      backgroundColor: '#aaaaaa',
      backgroundAlpha: 0.1
    })

    console.log('canvas render engine')

    drawAuxiliaryLine('auxiliaryCanvas')
  }, [])

  useEffect(() => {
    // 完整的路径测试代码

    const c = new Container()
    const redRect = new Graphics()
      .beginFill('red')
      .drawRect(400, 300, 200, 200)
      .on('click', () => {
        message.success(<span style={{ color: 'red' }}>点击了红色的矩形</span>)
      })
    c.addChild(redRect)
    const bluePoly = new Graphics()
      .beginFill('blue', 0.7)
      .moveTo(100, 200)
      .lineTo(400, 0)
      .lineTo(1000, 300)
      .lineTo(900, 600)
      .closePath()
      .on('click', () => {
        message.success(
          <span style={{ color: 'blue' }}>点击了蓝色的多边形</span>
        )
      })
    c.addChild(bluePoly)

    const path = new Graphics()
      .lineStyle(3, 'purple')
      .beginFill('pink', 0.6)
      .moveTo(100, 100)
      .lineTo(300, 100)
      .arc(300, 300, 200, Math.PI * 1.5, Math.PI * 2)
      .bezierCurveTo(500, 400, 600, 500, 700, 500)
      .lineTo(600, 300)
      .arcTo(700, 100, 800, 300, 150)
      .quadraticCurveTo(900, 100, 1100, 200)
      .closePath()
      .on('click', () => {
        message.success(
          <span style={{ color: 'pink' }}>点击了粉色的多边形</span>
        )
      })

    path.hitArea = new Rectangle(1000, 100, 100, 100)

    const greenCircle = new Graphics()
      .beginFill('green')
      .drawCircle(200, 400, 200)
      .on('click', () => {
        message.success(<span style={{ color: 'green' }}>点击了绿色的圆</span>)
      })

    appRef.current?.stage.addChild(c)
    appRef.current?.stage.addChild(path)
    appRef.current?.stage.addChild(greenCircle)
  }, [])

  useEffect(() => {
    return
    // 简单图形测试
    const graphic = new Graphics()
      .beginFill('red')
      .drawRect(100, 100, 100, 100)
      .beginFill('green')
      .drawCircle(100, 300, 100)
      .beginFill('pink')
      .drawEllipse(400, 200, 200, 100)
      .beginFill('brown')
      .drawRoundedRect(300, 400, 200, 100, 100)
      .beginFill('purple')
      .drawPolygon([
        600, 300, 700, 100, 800, 200, 1000, 100, 900, 400, 700, 600
      ])

    // graphic.rotation = Math.PI / 6

    appRef.current?.stage.addChild(graphic)
  }, [])

  useEffect(() => {
    return
    // arcTo测试代码

    const cir = new Graphics()
      .lineStyle(1, 'red')
      .moveTo(100, 100)
      .arcTo(300, 100, 200, 200, 80)

    appRef.current?.stage.addChild(cir)
  })

  useEffect(() => {
    return
    // 圆弧测试代码

    const cir = new Graphics()

    cir.lineStyle(1)
    // cir.moveTo(100, 100)
    cir.arc(200, 200, 100, Math.PI * 2.4, Math.PI * 6.5, true)
    // cir.lineTo(400, 200)

    appRef.current?.stage.addChild(cir)
  }, [])

  // useEffect(() => {
  //   const view = document.getElementById('canvas') as HTMLCanvasElement
  //   const ctx = view.getContext('2d') as CanvasRenderingContext2D
  //   ctx.moveTo(390, 185)
  //   ctx.arcTo(400, 200, 400, 200, 120)
  //   ctx.lineTo(300, 300)
  //   ctx.stroke()
  // }, [])

  useEffect(() => {
    return
    // 贝塞尔曲线测试代码

    const quadraticBezierCurve = new Graphics()
    quadraticBezierCurve.lineStyle(1)
    quadraticBezierCurve.moveTo(100, 100)
    quadraticBezierCurve.quadraticCurveTo(100, 300, 300, 300)

    appRef.current?.stage.addChild(quadraticBezierCurve)

    const bezierCurve = new Graphics()
    bezierCurve.lineStyle(1)
    bezierCurve.moveTo(400, 100)
    bezierCurve.bezierCurveTo(600, 100, 600, 400, 800, 400)

    // bezierCurve.rotation = Math.PI / 6

    appRef.current?.stage.addChild(bezierCurve)
  }, [])

  useEffect(() => {
    return
    // 测试代码
    const redGraphic = new Graphics()
    redGraphic.beginFill('red')
    redGraphic.drawRect(0, 0, 100, 100)
    redGraphic.alpha = 0.5

    const greenGraphic = new Graphics()
    greenGraphic.beginFill('green')
    greenGraphic.drawRect(0, 0, 100, 100)
    greenGraphic.alpha = 0.5
    greenGraphic.rotation = Math.PI / 4
    greenGraphic.position.set(100, 100)

    const c1 = new Container()
    const g1 = new Graphics()
    g1.beginFill('brown')
    g1.drawRect(0, 0, 100, 100)
    g1.rotation = Math.PI / 6
    g1.scale.set(2, 2)
    g1.skew.set(1, 1)
    g1.position.set(100, 100)
    c1.addChild(g1)

    const g2 = new Graphics()
    g2.beginFill('yellow')
    g2.lineStyle({ width: 60, color: 'green' })
    g2.drawRect(200, 200, 100, 100)
    g2.pivot.set(30, 30)
    g2.skew.set(-1, -1)
    g2.position.set(400, 200)
    c1.addChild(g2)

    const c2 = new Container()

    const c3 = new Container()
    const g3 = new Graphics()
    g3.beginFill('#182835')
    g3.drawRect(300, 300, 100, 100)
    g3.skew.set(-1, -1)
    g3.rotation = Math.PI / 2
    g3.scale.set(0.6, 0.8)
    g3.position.set(400, 200)
    c3.addChild(g3)

    const g4 = new Graphics()
    g4.beginFill('pink')
    g4.drawRect(200, 200, 100, 100)
    g4.pivot.set(30, 30)
    g4.skew.set(-1, -1)
    g4.position.set(400, 200)
    c3.addChild(g4)

    const g5 = new Graphics()
    g5.beginFill('#275821', 0.5)
    g5.drawRect(0, 0, 100, 100)
    g5.position.set(250, 400)
    g5.rotation = Math.PI / 1.5
    g5.scale.set(2, 3)
    g4.addChild(g5)

    c2.addChild(c3)
    c2.position.set(50, 50)

    const g6 = new Graphics()
    g6.beginFill('yellow', 0.5)
    g6.drawCircle(200, 100, 100)
    g6.lineStyle({ width: 10, color: 'blue' })

    g6.drawRoundedRect(300, 400, 200, 100, 30)

    g6.drawEllipse(400, 300, 100, 50)

    g6.lineStyle({ alpha: 0 })
    g6.moveTo(600, 200)
    g6.lineTo(700, 300)
    g6.lineTo(700, 500)
    g6.lineTo(500, 600)
    g6.closePath()

    appRef.current?.stage.addChild(redGraphic)
    appRef.current?.stage.addChild(greenGraphic)
    appRef.current?.stage.addChild(c1)
    appRef.current?.stage.addChild(c2)
    appRef.current?.stage.addChild(g6)
  }, [])

  return (
    <div className='app-container' style={{ position: 'relative' }}>
      <canvas
        width={width}
        height={height}
        id='auxiliaryCanvas'
        style={{ position: 'absolute', pointerEvents: 'none' }}
      ></canvas>
      <canvas id='canvas' width={width} height={height}></canvas>
    </div>
  )
}

export default App

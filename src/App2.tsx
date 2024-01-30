import { useEffect, useRef } from 'react'
import './App.css'
import { Application, Graphics, Container } from 'pixi.js-legacy'
import { drawAuxiliaryLine } from './utils'

const width = 1200
const height = 700

function App() {
  const appRef = useRef<Application>()
  useEffect(() => {
    appRef.current = new Application({
      view: document.getElementById('canvas') as HTMLCanvasElement,
      backgroundColor: '#ffffff',
      resolution: 1,
      backgroundAlpha: 0.1,
      forceCanvas: true,
      width,
      height
      // autoStart: false
    })

    console.log('pixijs')

    drawAuxiliaryLine('auxiliaryCanvas')

    // @ts-ignore
    globalThis.__PIXI_APP__ = appRef.current
  }, [])

  useEffect(() => {
    // 完整的路径测试代码

    const path = new Graphics()
      .beginFill('pink', 0.3)
      .lineStyle(3, 'green')
      .moveTo(100, 100)
      .lineTo(300, 100)
      .arc(300, 300, 200, Math.PI * 1.5, Math.PI * 2)
      .bezierCurveTo(500, 400, 600, 500, 700, 500)
      .lineTo(600, 300)
      .arcTo(700, 100, 800, 300, 150)
      .quadraticCurveTo(900, 100, 1100, 200)
      .closePath()

    appRef.current?.stage.addChild(path)
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
      .lineStyle(1)
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
    // cir.arc(200, 200, 100, Math.PI * 9, Math.PI / 2)

    const view = document.getElementById('canvas') as HTMLCanvasElement
    const ctx = view.getContext('2d') as CanvasRenderingContext2D
    ctx.arc(200, 200, 100, Math.PI * 2.4, Math.PI * 6.5, true)
    ctx.stroke()

    // appRef.current?.stage.addChild(cir)
  }, [])

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

    bezierCurve.rotation = Math.PI / 6

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

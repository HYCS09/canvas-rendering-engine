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
    const g1 = new Graphics()
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

    const g2 = new Graphics()
      .beginFill('green', 0.3)
      .moveTo(200, 200)
      .lineTo(400, 100)
      .lineTo(600, 200)
      .lineTo(500, 500)

    // path.addEventListener('mousemove', (e) => {
    //   console.log(e, e.global.x, e.global.y)
    // })
    g1.cursor = 'help'
    g2.cursor = 'pointer'

    g1.addChild(g2)

    g1.addEventListener('mouseenter', (e) => {
      console.log('g1', e.type, e.eventPhase)
    })
    g2.addEventListener('mouseenter', (e) => {
      console.log('g2', e.type, e.eventPhase)
    })
    g1.addEventListener(
      'mouseenter',
      (e) => {
        console.log('g1 true', e.type, e.eventPhase)
      },
      true
    )
    g2.addEventListener(
      'mouseenter',
      (e) => {
        console.log('g2 true', e.type, e.eventPhase)
      },
      true
    )

    appRef.current?.stage.addChild(g1)
    g1.eventMode = 'static'
    g2.eventMode = 'static'
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

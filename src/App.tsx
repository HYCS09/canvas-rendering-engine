import { useEffect, useRef } from 'react'
import './App.css'
import { Application, Graphics } from './lib'

const width = 1200
const height = 700

function App() {
  const appRef = useRef<Application>()
  useEffect(() => {
    const view = document.getElementById('canvas') as HTMLCanvasElement
    appRef.current = new Application({
      prefer: 'canvas2D',
      view,
      backgroundColor: '#aaaaaa',
      backgroundAlpha: 0.3
    })
  }, [])

  useEffect(() => {
    const redRect = new Graphics().beginFill('red').drawRect(400, 300, 200, 200)
    redRect.cursor = 'pointer'
    appRef.current?.stage.addChild(redRect)

    // 添加一个绿色的圆
    const greenCircle = new Graphics()
      .beginFill('green')
      .drawCircle(200, 400, 150)
    greenCircle.cursor = 'pointer'
    appRef.current?.stage.addChild(greenCircle)

    const bluePoly = new Graphics()
      .beginFill('blue', 0.7)
      .moveTo(100, 200)
      .lineTo(400, 100)
      .lineTo(1000, 300)
      .lineTo(900, 600)
      .lineTo(800, 400)
      .closePath()
    bluePoly.cursor = 'pointer'
    appRef.current?.stage.addChild(bluePoly)
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

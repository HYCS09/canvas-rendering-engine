import { useEffect, useRef } from 'react'
import './App.css'
import { Application, Graphics, RendererType, Rectangle, Point } from './lib'

const width = 1200
const height = 700

function App() {
  const appRef = useRef<Application>()

  useEffect(() => {
    const view = document.getElementById('canvas') as HTMLCanvasElement
    const app = new Application({
      rendererType: RendererType.Canvas,
      view,
      backgroundColor: '#aaaaaa'
      // backgroundAlpha: 0.1
    })
    appRef.current = app
    const g = new Graphics()
      .beginFill('gold')
      .moveTo(200, 200)
      .lineTo(400, 100)
      .lineTo(600, 200)
      .lineTo(700, 100)
      .lineTo(600, 500)
    g.cursor = 'pointer'
    g.scale.set(0.3, 0.8)
    g.position.set(100, 50)
    app.stage.addChild(g)

    let dragging = false
    let startPoint = new Point(g.x, g.y)
    let mouseDownPoint = new Point(0, 0)

    g.addEventListener('mousedown', (e) => {
      dragging = true
      mouseDownPoint = e.global.clone()
      startPoint = new Point(g.x, g.y)
    })
    app.stage.hitArea = new Rectangle(0, 0, width, height)
    app.stage.addEventListener('mousemove', (e) => {
      if (!dragging) {
        return
      }

      const newP = e.global.clone()
      const diffX = newP.x - mouseDownPoint.x
      const diffY = newP.y - mouseDownPoint.y
      g.position.set(startPoint.x + diffX, startPoint.y + diffY)
    })
    app.stage.addEventListener('mouseup', (e) => {
      dragging = false
    })
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

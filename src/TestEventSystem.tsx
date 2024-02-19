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

const width = 1200
const height = 400

function App() {
  const appRef = useRef<Application>()
  useEffect(() => {
    const view = document.getElementById('canvas') as HTMLCanvasElement
    appRef.current = new Application({
      rendererType: RendererType.Canvas,
      view,
      backgroundColor: '#aaaaaa'
      // backgroundAlpha: 0.1
    })

    console.log('canvas render engine')

    drawAuxiliaryLine('auxiliaryCanvas')
  }, [])

  useEffect(() => {
    const g1 = new Graphics()
      .beginFill('red', 0.3)
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
      .beginFill('brown')
      .moveTo(200, 200)
      .lineTo(400, 100)
      .lineTo(600, 200)
      .lineTo(500, 500)

    // path.addEventListener('mousemove', (e) => {
    //   console.log(e, e.global.x, e.global.y)
    // })

    const g3 = new Graphics().beginFill('green').drawRect(700, 200, 100, 100)

    const g4 = new Graphics().beginFill('blue').drawRect(400, 200, 100, 100)

    g1.cursor = 'help'
    g2.cursor = 'pointer'

    g2.addChild(g4)

    g1.addChild(g2)
    g1.addChild(g3)

    g1.addEventListener('mousedown', (e) => {
      console.log('g1', e.type, e.eventPhase)
    })
    g2.addEventListener('mousedown', (e) => {
      console.log('g2', e.type, e.eventPhase)
    })

    g1.addEventListener(
      'mousedown',
      (e) => {
        console.log('g1', e.type, e.eventPhase)
      },
      true
    )
    g2.addEventListener(
      'mousedown',
      (e) => {
        console.log('g2', e.type, e.eventPhase)
      },
      true
    )

    g1.addEventListener('mouseup', (e) => {
      console.log('g1', e.type, e.eventPhase)
    })
    g2.addEventListener('mouseup', (e) => {
      console.log('g2', e.type, e.eventPhase)
    })

    g1.addEventListener(
      'mouseup',
      (e) => {
        console.log('g1', e.type, e.eventPhase)
      },
      true
    )
    g2.addEventListener(
      'mouseup',
      (e) => {
        console.log('g2', e.type, e.eventPhase)
      },
      true
    )

    g1.addEventListener('click', (e) => {
      console.log('g1', e.type, e.eventPhase)
    })
    g2.addEventListener('click', (e) => {
      console.log('g2', e.type, e.eventPhase)
    })

    g1.addEventListener(
      'click',
      (e) => {
        console.log('g1', e.type, e.eventPhase)
      },
      true
    )
    g2.addEventListener(
      'click',
      (e) => {
        console.log('g2', e.type, e.eventPhase)
      },
      true
    )

    // g1.addEventListener('mousemove', (e) => {
    //   console.log('g1', e.type, e.eventPhase)
    // })
    // g2.addEventListener('mousemove', (e) => {
    //   console.log('g2', e.type, e.eventPhase)
    // })
    // g1.addEventListener(
    //   'mousemove',
    //   (e) => {
    //     console.log('g1', e.type, e.eventPhase)
    //   },
    //   true
    // )
    // g2.addEventListener(
    //   'mousemove',
    //   (e) => {
    //     console.log('g2', e.type, e.eventPhase)
    //   },
    //   true
    // )

    // g1.addEventListener('mouseenter', (e) => {
    //   console.log('g1', e.type, e.eventPhase)
    // })
    // g2.addEventListener('mouseenter', (e) => {
    //   console.log('g2', e.type, e.eventPhase)
    // })
    // g1.addEventListener(
    //   'mouseenter',
    //   (e) => {
    //     console.log('g1 true', e.type, e.eventPhase)
    //   },
    //   true
    // )
    // g2.addEventListener(
    //   'mouseenter',
    //   (e) => {
    //     console.log('g2 true', e.type, e.eventPhase)
    //   },
    //   true
    // )

    // g1.addEventListener('mouseenter', (e) => {
    //   console.log('g1', e.type, e.eventPhase)
    // })
    // g2.addEventListener('mouseenter', (e) => {
    //   console.log('g2', e.type, e.eventPhase)
    // })

    // g1.addEventListener('mouseleave', (e) => {
    //   console.log('g1', e.type, e.eventPhase)
    // })
    // g2.addEventListener('mouseleave', (e) => {
    //   console.log('g2', e.type, e.eventPhase)
    // })

    // g1.addEventListener('mouseover', (e) => {
    //   console.log('g1', e.type, e.eventPhase)
    // })
    // g2.addEventListener('mouseover', (e) => {
    //   console.log('g2', e.type, e.eventPhase)
    // })

    // g1.addEventListener('mouseout', (e) => {
    //   console.log('g1', e.type, e.eventPhase)
    // })
    // g2.addEventListener('mouseout', (e) => {
    //   console.log('g2', e.type, e.eventPhase)
    // })

    appRef.current?.stage.addChild(g1)
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

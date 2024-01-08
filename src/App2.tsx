import { useEffect, useRef } from 'react'
import './App.css'
import { Application, Graphics, Container } from 'pixi.js-legacy'

function App() {
  const appRef = useRef<Application>()
  useEffect(() => {
    appRef.current = new Application({
      view: document.getElementById('canvas') as HTMLCanvasElement,
      backgroundColor: '#ffffff',
      forceCanvas: true
    })

    // @ts-ignore
    globalThis.__PIXI_APP__ = appRef.current
  }, [])

  useEffect(() => {
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

    appRef.current?.stage.addChild(redGraphic)
    appRef.current?.stage.addChild(greenGraphic)
    appRef.current?.stage.addChild(c1)
    appRef.current?.stage.addChild(c2)
  }, [])

  return (
    <div className='app-container'>
      <canvas id='canvas' width={800} height={700}></canvas>
    </div>
  )
}

export default App

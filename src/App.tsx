import { useEffect, useRef } from 'react'
import './App.css'
import {
  Application,
  BaseTexture,
  Graphics,
  Rectangle,
  Sprite,
  Texture
} from './lib'
import dogImg from './imgs/dog512x512.jpeg'
import seaImg from './imgs/sea800x1198.jpeg'
import fieldsImg from './imgs/terraced-fields800x1200.jpeg'
import volcanoImg from './imgs/volcano800x1200.jpeg'

const width = 1200
const height = 700

function App() {
  const appRef = useRef<Application>()
  useEffect(() => {
    const view = document.getElementById('canvas') as HTMLCanvasElement
    appRef.current = new Application({
      // prefer: 'webGL',
      view,
      backgroundColor: 'pink',
      backgroundAlpha: 0.9
    })
  }, [])

  useEffect(() => {
    appRef.current?.init().then(() => {
      /**
       * 添加sprite
       */
      const img1 = new Image()
      img1.src = dogImg
      img1.onload = () => {
        const texture = Texture.from(img1)
        const sprite = new Sprite(texture)
        sprite.width = 200
        sprite.height = 200
        appRef.current?.stage.addChild(sprite)
      }

      const img2 = new Image()
      img2.src = seaImg
      img2.onload = () => {
        const sprite = Sprite.from(img2)
        sprite.width = 300
        sprite.height = 300
        sprite.position.set(0, 300)
        sprite.alpha = 0.7
        appRef.current?.stage.addChild(sprite)
      }

      const img3 = new Image()
      img3.src = fieldsImg
      img3.onload = () => {
        const baseTexture = BaseTexture.from(img3)
        const texture1 = new Texture(baseTexture, new Rectangle(0, 0, 400, 600))
        const sprite1 = new Sprite(texture1)
        sprite1.width = 200
        sprite1.height = 300
        sprite1.position.set(500, 50)
        appRef.current?.stage.addChild(sprite1)

        const texture2 = new Texture(
          baseTexture,
          new Rectangle(400, 600, 400, 600)
        )
        const sprite2 = new Sprite(texture2)
        sprite2.width = 200
        sprite2.height = 300
        sprite2.position.set(800, 50)
        sprite2.alpha = 0.7
        appRef.current?.stage.addChild(sprite2)
      }

      /**
       * graphics图片填充
       */
      const img4 = new Image()
      img4.src = volcanoImg
      img4.onload = () => {
        const texture = Texture.from(img4)
        const star = new Graphics()
          .beginTextureFill({ texture, alpha: 0.7 })
          .moveTo(400, 0)
          .lineTo(800, 600)
          .lineTo(400, 1200)
          .lineTo(0, 600)
          .closePath()
        star.scale.set(0.25)
        star.position.set(400, 400)
        appRef.current?.stage.addChild(star)
      }

      /**
       * 普通填充
       */
      const redRect = new Graphics()
        .beginFill('red')
        .drawRect(400, 300, 200, 200)
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

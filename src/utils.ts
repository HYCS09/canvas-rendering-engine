export const drawAuxiliaryLine = (canvasId: string, gap = 100) => {
  const canEle = document.getElementById(canvasId) as HTMLCanvasElement
  const ctx = canEle.getContext('2d') as CanvasRenderingContext2D

  const { width, height } = canEle

  const divEle = document.createElement('div')
  divEle.style.position = 'fixed'
  divEle.style.left = '0'
  divEle.style.top = '0'
  document.body.appendChild(divEle)

  canEle.addEventListener('mousemove', (e) => {
    const { clientX, clientY, offsetX, offsetY } = e
    divEle.style.opacity = '1'
    divEle.innerHTML = `${offsetX},${offsetY}`
    divEle.style.transform = `translate(${clientX + 10}px,${clientY + 10}px)`
  })

  canEle.addEventListener('mouseleave', (e) => {
    divEle.style.opacity = '0'
  })

  ctx.save()

  ctx.beginPath()

  for (let i = 0; i * gap < width; i++) {
    ctx.moveTo(i * gap, 0)
    ctx.lineTo(i * gap, height)
  }

  for (let j = 0; j * gap < height; j++) {
    ctx.moveTo(0, j * gap)
    ctx.lineTo(width, j * gap)
  }

  ctx.setLineDash([5])
  ctx.strokeStyle = 'grey'
  ctx.stroke()

  ctx.restore()
}

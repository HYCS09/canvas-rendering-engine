import { BYTES_PER_VERTEX, MAX_TEXTURES_COUNT } from '@/constants'
import { WebGLRenderer } from '../../WebGLRenderer'
import { vertexShaderSource, fragmentShaderSource } from './shaders'

const createShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader => {
  const shader = gl.createShader(type) as WebGLShader
  gl.shaderSource(shader, source)

  gl.compileShader(shader)
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (compiled) {
    return shader
  } else {
    const err = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    console.error(`编译shader错误：${err}`)
    throw new Error(`编译shader错误：${err}`)
  }
}

const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram() as WebGLProgram
  if (!program) {
    console.error(`创建program失败`)
    throw new Error(`创建program失败`)
  }

  gl.attachShader(program, vertexShader) // 内部会判断是vertexShader还是fragmentShader
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)
  // 检查link结果
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    const err = gl.getProgramInfoLog(program)
    console.error(`link出错：${err}`)
    gl.deleteProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    throw new Error(`link出错：${err}`)
  }

  gl.useProgram(program)

  return program
}

const setVertexAttribPointer = (
  gl: WebGLRenderingContext,
  program: WebGLProgram
) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())

  const aPositionLoc = gl.getAttribLocation(program, `a_position`)
  gl.vertexAttribPointer(
    aPositionLoc, // attribute变量的location
    2, // 读2个单元(8个字节)
    gl.FLOAT, //类型
    false, //不需要正交化
    BYTES_PER_VERTEX, //跨度(24个字节)
    0 // 从每组的下标为0的字节开始读
  )
  gl.enableVertexAttribArray(aPositionLoc)

  const aUvLoc = gl.getAttribLocation(program, `a_uv`)
  gl.vertexAttribPointer(
    aUvLoc, // attribute变量的location
    2, // 读2个单元(8个字节)
    gl.FLOAT, //类型
    false, //不需要正交化
    BYTES_PER_VERTEX, //跨度(24个字节)
    Float32Array.BYTES_PER_ELEMENT * 2 // 从每组的下标为8的字节开始读
  )
  gl.enableVertexAttribArray(aUvLoc)

  const aColorLoc = gl.getAttribLocation(program, `a_color`)
  gl.vertexAttribPointer(
    aColorLoc, // attribute变量的location
    4, // 读4个单元(4个字节)
    gl.UNSIGNED_BYTE, //类型
    true, //需要正交化
    BYTES_PER_VERTEX, //跨度(24个字节)
    4 * Float32Array.BYTES_PER_ELEMENT // 从每组的下标为16的字节开始读
  )
  gl.enableVertexAttribArray(aColorLoc)

  const aTextureIdLoc = gl.getAttribLocation(program, `a_texture_id`)
  gl.vertexAttribPointer(
    aTextureIdLoc, // attribute变量的location
    1, // 读1个单元(1个字节)
    gl.UNSIGNED_BYTE, //类型
    false, //不需要正交化
    BYTES_PER_VERTEX, //跨度(24个字节)
    5 * Float32Array.BYTES_PER_ELEMENT // 从每组的下标为20的字节开始读
  )
  gl.enableVertexAttribArray(aTextureIdLoc)
}

export const initShader = (renderer: WebGLRenderer) => {
  const gl = renderer.gl

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  )

  const program = createProgram(gl, vertexShader, fragmentShader)

  setVertexAttribPointer(gl, program)

  // 设置sampler变量绑定的location
  for (let i = 0; i < MAX_TEXTURES_COUNT; i++) {
    const uSamplerLoc = gl.getUniformLocation(program, `u_samplers[${i}]`)
    gl.uniform1i(uSamplerLoc, i)
  }

  // 指定混合模式
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

  return program
}

import { IApplicationOptions } from '@/types'
import {
  vertexShaderSource,
  fragmentShaderSource
} from './utils/webgpu/shaders'
import { BYTES_PER_VERTEX, MAX_TEXTURES_COUNT, SAMPLE_COUNT } from '@/constants'
import { toRgbArray } from '@/utils/color'
import { BatchRenderer } from './BatchRenderer'
import { DrawCall } from './utils/batch/DrawCall'
import { Texture } from '@/texture'

const bindGroupCache: Record<string, GPUBindGroup> = {}

export class WebGPURenderer extends BatchRenderer {
  private gpu: GPUCanvasContext
  private device!: GPUDevice
  private pipeline!: GPURenderPipeline
  private renderPassDescriptor!: GPURenderPassDescriptor
  private options: IApplicationOptions
  private sampler!: GPUSampler

  /**
   * 顶点的webGPU buffer
   */
  private gpuVertexBuffer!: GPUBuffer

  /**
   * 顶点下标的webGPU buffer
   */
  private gpuIndexBuffer!: GPUBuffer

  /**
   * 投影矩阵的webGPU buffer
   */
  private projectionMatBuffer!: GPUBuffer

  /**
   * stage的变换矩阵的webGPU buffer
   */
  private stageMatBuffer!: GPUBuffer

  /**
   * uniform变量的bind group
   */

  private uniformBindGroup!: GPUBindGroup

  constructor(options: IApplicationOptions) {
    console.log(
      '正在使用 %c webGPU ',
      'color: #0072c6; background-color: #ffffff;font-size: 20px;',
      '渲染'
    )

    super(options)

    this.options = options

    this.gpu = this.canvasEle.getContext('webgpu') as GPUCanvasContext

    this.curVertBufferLength = 256
    this.curIndexBufferLength = 256
  }

  public async init() {
    await this.initDevice()

    this.initGpuBuffer()
    this.initRenderPassDescriptor()
    this.createPipeline()
    this.initUniformBindGroup()

    this.setRootTransform(1, 0, 0, 1, 0, 0)

    this.setProjectionMatrix()

    this.sampler = this.device.createSampler({
      addressModeU: 'repeat',
      addressModeV: 'repeat',
      addressModeW: 'repeat',
      magFilter: 'linear',
      minFilter: 'linear',
      mipmapFilter: 'linear'
    })
  }

  protected draw(): void {
    const {
      device,
      renderPassDescriptor,
      gpuVertexBuffer,
      gpuIndexBuffer,
      gpu,
      uniformBindGroup,
      pipeline
    } = this

    const commandEncoder = device.createCommandEncoder()

    // @ts-ignore
    renderPassDescriptor.colorAttachments[0].view = gpu
      .getCurrentTexture()
      .createView()

    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor)

    // 设置顶点数组和顶点下标数组
    renderPass.setVertexBuffer(0, gpuVertexBuffer)
    renderPass.setIndexBuffer(gpuIndexBuffer, 'uint32')

    // 设置投影矩阵和stage的变换矩阵
    renderPass.setBindGroup(0, uniformBindGroup)

    for (let i = 0; i < this.drawCallCount; i++) {
      const drawCall = this.drawCalls[i]

      const { start, size } = drawCall

      const bindGroup = this.getBindGroup(drawCall)

      renderPass.setPipeline(pipeline)
      renderPass.setBindGroup(1, bindGroup)

      renderPass.drawIndexed(size, 1, start)
    }

    renderPass.end()

    const commandBuffer = commandEncoder.finish()

    device.queue.submit([commandBuffer])
  }

  private getBindGroup(drawCall: DrawCall) {
    const { bindGroupKey, texCount, baseTextures } = drawCall

    if (!bindGroupCache[bindGroupKey]) {
      const entries: GPUBindGroupDescriptor['entries'] = [
        {
          binding: 0,
          resource: this.sampler
        }
      ]

      for (let i = 0; i < texCount; i++) {
        const baseTexture = baseTextures[i]
        if (!baseTexture.gpuTexture) {
          baseTexture.createGpuTexture(this.device)
          baseTexture.gpuUpload(this.device)
        }

        // @ts-ignore
        entries.push({
          binding: i + 1,
          resource: baseTexture.gpuTexture!.createView()
        })
      }

      bindGroupCache[bindGroupKey] = this.device.createBindGroup({
        label: `my-bind-group-${bindGroupKey}`,
        layout: this.pipeline.getBindGroupLayout(1),
        entries
      })
    }

    return bindGroupCache[bindGroupKey]
  }

  /**
   * 创建投影矩阵和stage的变换矩阵对应的gpu buffer
   */
  private initUniformBindGroup() {
    const device = this.device

    this.stageMatBuffer = device.createBuffer({
      label: 'stage-matrix-uniform-buffer',
      size: 12 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })

    this.projectionMatBuffer = device.createBuffer({
      label: 'projection-matrix-uniform-buffer',
      size: 12 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })

    this.uniformBindGroup = this.device.createBindGroup({
      label: 'my-uniform-bind-group',
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: this.stageMatBuffer }
        },
        {
          binding: 1,
          resource: {
            buffer: this.projectionMatBuffer
          }
        }
      ]
    })
  }

  /**
   * 创建顶点数组和顶点下标数组的gpu buffer
   */
  private initGpuBuffer() {
    const device = this.device

    this.gpuVertexBuffer = device.createBuffer({
      label: 'my-gpu-vertex-buffer',
      size: this.curVertBufferLength * BYTES_PER_VERTEX,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })

    this.gpuIndexBuffer = device.createBuffer({
      label: 'my-gpu-index-buffer',
      size: this.curIndexBufferLength * Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })
  }

  protected updateBuffer(): void {
    const device = this.device

    if (this.vertexCount > this.curVertBufferLength) {
      this.gpuVertexBuffer.destroy()

      this.gpuVertexBuffer = device.createBuffer({
        label: 'my-gpu-vertex-buffer',
        size: this.vertexCount * BYTES_PER_VERTEX,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
      })

      this.curVertBufferLength = this.vertexCount
    }
    device.queue.writeBuffer(this.gpuVertexBuffer, 0, this.vertFloatView)

    if (this.indexCount > this.curIndexBufferLength) {
      this.gpuIndexBuffer.destroy()

      this.gpuIndexBuffer = device.createBuffer({
        label: 'my-gpu-index-buffer',
        size: this.indexCount * Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
      })

      this.curIndexBufferLength = this.indexCount
    }
    device.queue.writeBuffer(this.gpuIndexBuffer, 0, this.indexBuffer)
  }

  protected setRootTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
  ): void {
    this.device.queue.writeBuffer(
      this.stageMatBuffer,
      0,
      new Float32Array([
        // eslint-disable-next-line prettier/prettier
        a,  b,  0, 0, // 矩阵第一列 
        // eslint-disable-next-line prettier/prettier
        c,  d,  0, 0, // 矩阵第二列
        // eslint-disable-next-line prettier/prettier
        tx, ty, 1, 0  // 矩阵第三列
      ])
    )
  }

  protected setProjectionMatrix(): void {
    const width = this.canvasEle.width
    const height = this.canvasEle.height

    const scaleX = (1 / width) * 2
    const scaleY = (1 / height) * 2

    this.device.queue.writeBuffer(
      this.projectionMatBuffer,
      0,
      new Float32Array([
        // eslint-disable-next-line prettier/prettier
        scaleX, 0,       0, 0, // 矩阵第一列 
        // eslint-disable-next-line prettier/prettier
        0,      -scaleY, 0, 0, // 矩阵第二列
        // eslint-disable-next-line prettier/prettier
        -1,     1,       1, 0  // 矩阵第三列
      ])
    )
  }

  /**
   * 初始化pipeline
   */
  private createPipeline() {
    this.pipeline = this.device.createRenderPipeline({
      layout: 'auto',
      label: 'my-render-pipeline',
      vertex: {
        module: this.device.createShaderModule({
          code: vertexShaderSource,
          label: 'my-vert-shader-module'
        }),
        entryPoint: 'main',
        buffers: [
          {
            arrayStride: BYTES_PER_VERTEX,
            attributes: [
              {
                shaderLocation: 0, // @location(0) a_position
                format: 'float32x2', // 读2个Float32，不用正交化
                offset: 0
              },
              {
                shaderLocation: 1, // @location(1) a_uv
                format: 'float32x2', // 读2个Float32，不用正交化
                offset: 2 * Float32Array.BYTES_PER_ELEMENT
              },
              {
                shaderLocation: 2, // @location(2) a_color
                format: 'unorm8x4', // 读4个UInt8并且正交化
                offset: 4 * Float32Array.BYTES_PER_ELEMENT
              },
              {
                shaderLocation: 3, // @location(3) a_texture_id_etc
                format: 'uint8x4', // 读4个UInt8，不用正交化
                offset: 5 * Float32Array.BYTES_PER_ELEMENT
              }
            ]
          }
        ]
      },
      fragment: {
        module: this.device.createShaderModule({
          code: fragmentShaderSource,
          label: 'my-frag-shader-module'
        }),
        entryPoint: 'main',
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
            blend: {
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add'
              },
              color: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add'
              }
            }
          }
        ]
      },
      multisample: {
        count: SAMPLE_COUNT
      },
      primitive: {
        topology: 'triangle-list'
      }
    })
  }

  /**
   * 初始化device
   */
  private async initDevice() {
    const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter

    const device = await adapter.requestDevice()

    this.gpu.configure({
      device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'premultiplied'
    })

    this.device = device
  }

  /**
   * 初始化renderPassDescriptor
   */
  private initRenderPassDescriptor() {
    const { backgroundColor, backgroundAlpha } = this.options

    const a = backgroundAlpha as number

    const [r, g, b] = toRgbArray(backgroundColor as string).map((n) => n * a)

    this.renderPassDescriptor = {
      label: 'my-render-pass-descriptor',
      colorAttachments: [
        {
          view: this.gpu.getCurrentTexture().createView(),
          storeOp: 'store',
          loadOp: 'clear',
          clearValue: [r, g, b, a]
        }
      ]
    }
  }
}

// 顶点位置2个Float32，uv坐标2个Float32，顶点颜色4个Unsigned Byte，texture id 1个byte(但是仍然要占据4个byte)，一共24个byte
export const VERTEX_SIZE = 6

export const BYTES_PER_VERTEX = VERTEX_SIZE * 4 // 每个顶点占多少字节

export const MAX_TEXTURES_COUNT = 16

export const SAMPLE_COUNT = 1

/**
 * 顶点着色器
 */
export const vertexShaderSource = /*glsl*/ `
precision highp float;
attribute vec2 a_position;
attribute vec2 a_uv;
attribute vec4 a_color;
attribute float a_texture_id;

varying vec2 v_uv;
varying vec4 v_color;
varying float v_texture_id;

uniform mat3 u_root_transform;
uniform mat3 u_projection_matrix;

void main(){
  v_uv = a_uv;
  v_color = vec4(a_color.rgb * a_color.a, a_color.a);
  v_texture_id = a_texture_id;

  gl_Position = vec4((u_projection_matrix * u_root_transform * vec3(a_position, 1.0)).xy, 0.0, 1.0);
}
`.trim()

/**
 * 片元着色器
 */
export const fragmentShaderSource = /*glsl*/ `
precision mediump float;

varying vec2 v_uv;
varying vec4 v_color;
varying float v_texture_id;

uniform sampler2D u_samplers[16];

void main(){
  vec4 color;

  if(v_texture_id < 0.5)
  {
    color = texture2D(u_samplers[0], v_uv);
  }
  else if(v_texture_id < 1.5)
  {
    color = texture2D(u_samplers[1], v_uv);
  }
  else if(v_texture_id < 2.5)
  {
    color = texture2D(u_samplers[2], v_uv);
  }
  else if(v_texture_id < 3.5)
  {
    color = texture2D(u_samplers[3], v_uv);
  }
  else if(v_texture_id < 4.5)
  {
    color = texture2D(u_samplers[4], v_uv);
  }
  else if(v_texture_id < 5.5)
  {
    color = texture2D(u_samplers[5], v_uv);
  }
  else if(v_texture_id < 6.5)
  {
    color = texture2D(u_samplers[6], v_uv);
  }
  else if(v_texture_id < 7.5)
  {
    color = texture2D(u_samplers[7], v_uv);
  }
  else if(v_texture_id < 8.5)
  {
    color = texture2D(u_samplers[8], v_uv);
  }
  else if(v_texture_id < 9.5)
  {
    color = texture2D(u_samplers[9], v_uv);
  }
  else if(v_texture_id < 10.5)
  {
    color = texture2D(u_samplers[10], v_uv);
  }
  else if(v_texture_id < 11.5)
  {
    color = texture2D(u_samplers[11], v_uv);
  }
  else if(v_texture_id < 12.5)
  {
    color = texture2D(u_samplers[12], v_uv);
  }
  else if(v_texture_id < 13.5)
  {
    color = texture2D(u_samplers[13], v_uv);
  }
  else if(v_texture_id < 14.5)
  {
    color = texture2D(u_samplers[14], v_uv);
  }
  else 
  {
    color = texture2D(u_samplers[15], v_uv);
  }

  gl_FragColor = color * v_color;
}
`.trim()

/**
 * 顶点着色器
 */
export const vertexShaderSource = /* wgsl */ `
@group(0) @binding(0) var<uniform> u_root_transform: mat3x3<f32>;
@group(0) @binding(1) var<uniform> u_projection_matrix: mat3x3<f32>;

struct VertOutput {
  @builtin(position) v_position: vec4<f32>,
  @location(0) v_uv: vec2<f32>,
  @location(1) v_color: vec4<f32>,
  @location(2) @interpolate(flat) v_texture_id : u32,
};

@vertex
fn main(
  @location(0) a_position: vec2<f32>,
  @location(1) a_uv: vec2<f32>,
  @location(2) a_color: vec4<f32>,
  @location(3) a_texture_id_etc: vec4<u32>
) -> VertOutput {

  let v_position = vec4<f32>((u_projection_matrix * u_root_transform * vec3<f32>(a_position, 1.0)).xy, 0.0, 1.0);
  let v_uv = a_uv;
  let v_color = vec4<f32>(a_color.rgb * a_color.a, a_color.a);
  let v_texture_id = a_texture_id_etc.x;

  return VertOutput(v_position, v_uv, v_color, v_texture_id);
}
`

/**
 * 片元着色器
 */
export const fragmentShaderSource = /* wgsl */ `
@group(1) @binding(0) var u_sampler: sampler;
@group(1) @binding(1) var u_base_texture_1: texture_2d<f32>;
@group(1) @binding(2) var u_base_texture_2: texture_2d<f32>;
@group(1) @binding(3) var u_base_texture_3: texture_2d<f32>;
@group(1) @binding(4) var u_base_texture_4: texture_2d<f32>;
@group(1) @binding(5) var u_base_texture_5: texture_2d<f32>;
@group(1) @binding(6) var u_base_texture_6: texture_2d<f32>;
@group(1) @binding(7) var u_base_texture_7: texture_2d<f32>;
@group(1) @binding(8) var u_base_texture_8: texture_2d<f32>;
@group(1) @binding(9) var u_base_texture_9: texture_2d<f32>;
@group(1) @binding(10) var u_base_texture_10: texture_2d<f32>;
@group(1) @binding(11) var u_base_texture_11: texture_2d<f32>;
@group(1) @binding(12) var u_base_texture_12: texture_2d<f32>;
@group(1) @binding(13) var u_base_texture_13: texture_2d<f32>;
@group(1) @binding(14) var u_base_texture_14: texture_2d<f32>;
@group(1) @binding(15) var u_base_texture_15: texture_2d<f32>;
@group(1) @binding(16) var u_base_texture_16: texture_2d<f32>;

@fragment
fn main(
  @location(0) v_uv: vec2<f32>,
  @location(1) v_color: vec4<f32>,
  @location(2) @interpolate(flat) v_texture_id : u32,
) -> @location(0) vec4<f32> {

  var texture_color: vec4<f32>;

  let dx = dpdx(v_uv);
  let dy = dpdy(v_uv);

  switch v_texture_id {
    case 0:{
      texture_color = textureSampleGrad(u_base_texture_1, u_sampler, v_uv, dx, dy);
      break;
    }
    case 1:{
      texture_color = textureSampleGrad(u_base_texture_2, u_sampler, v_uv, dx, dy);
      break;
    }
    case 2:{
      texture_color = textureSampleGrad(u_base_texture_3, u_sampler, v_uv, dx, dy);
      break;
    }
    case 3:{
      texture_color = textureSampleGrad(u_base_texture_4, u_sampler, v_uv, dx, dy);
      break;
    }
    case 4:{
      texture_color = textureSampleGrad(u_base_texture_5, u_sampler, v_uv, dx, dy);
      break;
    }
    case 5:{
      texture_color = textureSampleGrad(u_base_texture_6, u_sampler, v_uv, dx, dy);
      break;
    }
    case 6:{
      texture_color = textureSampleGrad(u_base_texture_7, u_sampler, v_uv, dx, dy);
      break;
    }
    case 7:{
      texture_color = textureSampleGrad(u_base_texture_8, u_sampler, v_uv, dx, dy);
      break;
    }
    case 8:{
      texture_color = textureSampleGrad(u_base_texture_9, u_sampler, v_uv, dx, dy);
      break;
    }
    case 9:{
      texture_color = textureSampleGrad(u_base_texture_10, u_sampler, v_uv, dx, dy);
      break;
    }
    case 10:{
      texture_color = textureSampleGrad(u_base_texture_11, u_sampler, v_uv, dx, dy);
      break;
    }
    case 11:{
      texture_color = textureSampleGrad(u_base_texture_12, u_sampler, v_uv, dx, dy);
      break;
    }
    case 12:{
      texture_color = textureSampleGrad(u_base_texture_13, u_sampler, v_uv, dx, dy);
      break;
    }
    case 13:{
      texture_color = textureSampleGrad(u_base_texture_14, u_sampler, v_uv, dx, dy);
      break;
    }
    case 14:{
      texture_color = textureSampleGrad(u_base_texture_15, u_sampler, v_uv, dx, dy);
      break;
    }
    default:{
      texture_color = textureSampleGrad(u_base_texture_16, u_sampler, v_uv, dx, dy);
      break;
    }
  }

  return texture_color * v_color;
}
`

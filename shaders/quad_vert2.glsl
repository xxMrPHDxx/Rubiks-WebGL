#version 300 es
in vec3 a_pos;

uniform mat4 u_viewMatrix;
uniform mat4 u_camMatrix;
uniform mat4 u_objMatrix;
uniform vec4 u_color;

out vec4 v_color;
out float v_dist;

void main(){
  v_color = u_color;
  vec4 pos = u_viewMatrix * u_camMatrix * u_objMatrix * vec4(a_pos, 1.0);
  v_dist = pos.z;
  gl_Position = pos;
}
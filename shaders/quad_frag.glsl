#version 300 es
precision highp float;

in vec4 v_color;
in float v_dist;

out vec4 finalColor;

void main(){
  finalColor = vec4(v_color.xyz/(v_dist*0.1+1.0), 1.0);
}
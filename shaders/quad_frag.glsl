#version 300 es
precision highp float;

in vec4 v_color;
in float v_dist;

out vec4 finalColor;

void main(){
  finalColor = v_color/(v_dist*0.08+1.0);
}
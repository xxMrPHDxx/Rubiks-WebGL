precision highp float;

varying vec4 v_color;
varying float v_dist;

void main(){
  gl_FragColor = vec4(v_color.xyz/(v_dist*0.1+1.0), 1.0);
}

import Quad from './quad.js';

const Color = {
  RED: [1.0,0.0,0.0,1.0],
  GREEN: [0.0,1.0,0.0,1.0],
  BLUE: [0.0,0.0,1.0,1.0],
  BROWN: [1.0,1.0,0.0,1.0],
  PINK: [1.0,0.0,1.0,1.0],
  CYAN: [0.0,1.0,1.0,1.0],
};

const COLORS = Object.entries(Color).map(([k, v])=>v);

export default class Cube {
  constructor(quad, x, y, z, flag=0){
    this.quad = quad;
    this.pos = new vec3(x, y, z);
    this.faces = [
      { pos: new vec3(   0,   0,-0.5).add(this.pos), angle: new vec3(0,  0,0) },
      { pos: new vec3(   0,   0, 0.5).add(this.pos), angle: new vec3(0,180,0) },
      { pos: new vec3(-0.5,   0,   0).add(this.pos), angle: new vec3(0, 90,0) },
      { pos: new vec3( 0.5,   0,   0).add(this.pos), angle: new vec3(0,270,0) },
      { pos: new vec3(   0,-0.5,   0).add(this.pos), angle: new vec3(90,  0,0) },
      { pos: new vec3(   0, 0.5,   0).add(this.pos), angle: new vec3(90,  0,0) },
    ];
    this.l = (flag&(1<<0))>>0;
    this.r = (flag&(1<<1))>>1;
    this.u = (flag&(1<<2))>>2;
    this.d = (flag&(1<<3))>>3;
    this.f = (flag&(1<<4))>>4;
    this.b = (flag&(1<<5))>>5;
  }
  setCamera(projMatrix, viewMatrix){
    this.quad.setCamera(projMatrix, viewMatrix);
  }
  draw(){
    const [f,b,l,r,u,d] = this.faces;
    if(this.u) this.quad.draw(u.pos, u.angle, 1, COLORS[0]);
    if(this.d) this.quad.draw(d.pos, d.angle, 1, COLORS[1]);
    if(this.l) this.quad.draw(l.pos, l.angle, 1, COLORS[2]);
    if(this.r) this.quad.draw(r.pos, r.angle, 1, COLORS[3]);
    if(this.f) this.quad.draw(f.pos, f.angle, 1, COLORS[4]);
    if(this.b) this.quad.draw(b.pos, b.angle, 1, COLORS[5]);
  }
}
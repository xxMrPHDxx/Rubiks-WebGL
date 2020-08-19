import Quad from './quad.js';

const Color = {
  RED: [1.0,0.0,0.0,1.0],
  GREEN: [0.0,1.0,0.0,1.0],
  BLUE: [0.0,0.0,1.0,1.0],
  BROWN: [1.0,1.0,0.0,1.0],
  PINK: [1.0,0.0,1.0,1.0],
  CYAN: [0.0,1.0,1.0,1.0],
};

const BLACK = [0.0,0.0,0.0,1.0];

const COLORS = Object.entries(Color).map(([k, v])=>v);

export default class Cube {
  constructor(quad, x, y, z, flag=0, hidden=false){
    this.quad = quad;
    this.pos = new vec3(x, y, z);
    this.flag = flag;
    this.faces = [
      { pos: new vec3(   0,   0,-0.5).add(this.pos), angle: new vec3(0,  0,0) },
      { pos: new vec3(   0,   0, 0.5).add(this.pos), angle: new vec3(0,180,0) },
      { pos: new vec3(-0.5,   0,   0).add(this.pos), angle: new vec3(0, 90,0) },
      { pos: new vec3( 0.5,   0,   0).add(this.pos), angle: new vec3(0,270,0) },
      { pos: new vec3(   0,-0.5,   0).add(this.pos), angle: new vec3(-90,  0,0) },
      { pos: new vec3(   0, 0.5,   0).add(this.pos), angle: new vec3(90,  0,0) },
    ];
    this.l = (flag&(1<<0))>>0;
    this.r = (flag&(1<<1))>>1;
    this.u = (flag&(1<<2))>>2;
    this.d = (flag&(1<<3))>>3;
    this.f = (flag&(1<<4))>>4;
    this.b = (flag&(1<<5))>>5;
    this.angle = new vec3(0, 0, 0);
    this.hidden = hidden;
  }
  setCamera(projMatrix, viewMatrix){
    this.quad.setCamera(projMatrix, viewMatrix);
  }
  draw(){
    const show = !this.hidden;
    const [f,b,l,r,u,d] = this.faces;
    if(show||this.u) this.quad.draw(u.pos, this.angle, u.angle, 1, (show&&!this.u)?BLACK:COLORS[0], this.flag);
    if(show||this.d) this.quad.draw(d.pos, this.angle, d.angle, 1, (show&&!this.d)?BLACK:COLORS[1], this.flag);
    if(show||this.l) this.quad.draw(l.pos, this.angle, l.angle, 1, (show&&!this.l)?BLACK:COLORS[2], this.flag);
    if(show||this.r) this.quad.draw(r.pos, this.angle, r.angle, 1, (show&&!this.r)?BLACK:COLORS[3], this.flag);
    if(show||this.f) this.quad.draw(f.pos, this.angle, f.angle, 1, (show&&!this.f)?BLACK:COLORS[4], this.flag);
    if(show||this.b) this.quad.draw(b.pos, this.angle, b.angle, 1, (show&&!this.b)?BLACK:COLORS[5], this.flag);
  }
}
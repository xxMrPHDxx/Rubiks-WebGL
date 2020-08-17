import Cube from './cube.js';
import Quad from './quad.js';

const chk = (v,d) => v>0 && v < d-1;

export default class Rubiks {
  constructor(gl, shader, dimension=3){
    this.quad = new Quad(gl, shader);
    this.dimension = dimension;
    this.cubes = [];
    const mid = dimension / 2;
    for(let x=0; x<dimension; x++)
    for(let y=0; y<dimension; y++)
    for(let z=0; z<dimension; z++){
      if(chk(x,dimension)&&chk(y,dimension)&&chk(z,dimension)) continue;
      let flag = 0;
      if(x === 0)           flag |= 1<<0;
      if(x === dimension-1) flag |= 1<<1;
      if(y === 0)           flag |= 1<<2;
      if(y === dimension-1) flag |= 1<<3;
      if(z === 0)           flag |= 1<<4;
      if(z === dimension-1) flag |= 1<<5;
      this.cubes.push(new Cube(this.quad, x-mid, y-mid, z-mid, flag));
    }
  }
  setCamera(projMatrix, viewMatrix){
    this.quad.setCamera(projMatrix, viewMatrix);
  }
  draw(){
    for(const cube of this.cubes) cube.draw();
  }
}
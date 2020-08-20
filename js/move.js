import Cube from './cube.js';

const HALF_PI = Math.PI / 2;
const TWO_PI  = Math.PI * 2;

const AxisX = Symbol('X');
const AxisY = Symbol('Y');
const AxisZ = Symbol('Z');

export const Axis = {
  X: AxisX, x: AxisX,
  Y: AxisY, y: AxisY,
  Z: AxisZ, z: AxisZ,
}

const map = window.map = (val, fmin, fmax, tmin, tmax)=>{
  return tmin + (val-fmin) * (tmax - tmin) / (fmax - fmin);
};

export default class Move {
  constructor(axis, dir, ...cubes){
    if(cubes[0] && typeof cubes[0].length === 'number') cubes = cubes[0];
    if(cubes.length === 0) throw new Error('No cube to move!');
    if(![AxisX, AxisY, AxisZ].includes(axis)) throw new Error('Invalid axis!');
    this.axis = axis;
    this.dir = typeof dir === 'number' && dir !== 0 ? (dir > 0 ? 1 : -1) : 1;
    this.cubes = cubes.filter(cube => cube instanceof Cube);
    this.counter = this.max_counter;
  }
  get done(){ return this.counter >= this.max_counter; }
  get inc(){ return this.dir * HALF_PI / this.max_counter; }
  get max_counter(){ return 8; }
  start(){ this.counter = 0; }
  update(){
    if(this.done) return;
    for(const cube of this.cubes){
      switch(this.axis){
        case AxisX: {
          cube.angle.x += this.inc;
          if(cube.angle.x < 0) cube.angle.x = TWO_PI - cube.angle.x;
        } break;
        case AxisY: {
          cube.angle.y += this.inc;
          if(cube.angle.y < 0) cube.angle.y = TWO_PI - cube.angle.y;
        } break;
        case AxisZ: {
          cube.angle.z += this.inc;
          if(cube.angle.z < 0) cube.angle.z = TWO_PI - cube.angle.z;
        } break;
      }
    }
    this.counter++;
  }
}
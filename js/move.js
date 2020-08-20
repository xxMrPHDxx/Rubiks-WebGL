import Cube from './cube.js';

const HALF_PI = Math.PI / 2;

const AxisX = Symbol('X');
const AxisY = Symbol('Y');
const AxisZ = Symbol('Z');

export const Axis = {
  X: AxisX, x: AxisX,
  Y: AxisY, y: AxisY,
  Z: AxisZ, z: AxisZ,
}

export default class Move {
  constructor(axis, dir, ...cubes){
    if(cubes[0] && typeof cubes[0].length === 'number') cubes = cubes[0];
    if(cubes.length === 0) throw new Error('No cube to move!');
    if(![AxisX, AxisY, AxisZ].includes(axis)) throw new Error('Invalid axis!');
    this.axis = axis;
    this.dir = typeof dir === 'number' && dir !== 0 ? (dir > 0 ? 1 : -1) : 1;
    this.cubes = cubes.filter(cube => cube instanceof Cube);
    this.angle = 0;
    this.target_angle = this.dir * HALF_PI;
    this.started = false;
    this._speed = 0.05;
  }
  get done(){ return (this.target_angle - this.angle) < Math.pow(10,-10); }
  get rotation(){ 
    return new vec3(...(
      this.axis === AxisX ? 
        [this.angle, 0, 0] : 
        (this.axis === AxisY ? [0, this.angle, 0] : [0, 0, this.angle])
      )
    );
  }
  get speed(){ return this._speed; }
  start(){ this.started = true; }
  update(){
    if(!this.started || this.done) return 0;
    const inc = this.angle + this.dir * this.speed;
    this.angle = (inc) > this.target_angle ? this.target_angle : inc;
    for(const cube of this.cubes) cube.angle = this.rotation;
    if(this.done) {
      this.target_angle += this.dir * HALF_PI;
      this.started = false;
    }
  }
}
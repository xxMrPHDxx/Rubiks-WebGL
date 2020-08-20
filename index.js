import Shader from './js/shader.js';
import Rubiks from './js/rubiks.js';
import Move, { Axis } from './js/move.js';

const canvas = document.querySelector('canvas#screen');
canvas.setAttribute('width', window.WIDTH = innerWidth);
canvas.setAttribute('height', window.HEIGHT = innerHeight);
const gl2 = canvas.getContext('webgl2');
const gl = gl2 === null ? 
						canvas.getContext('webgl') :
						gl2;
const FPS = 30;
const msPerTick = 1000/FPS;
const TWO_PI = Math.PI*2, HALF_PI = Math.PI/2;

const camMatrix = mat4.lookAt([0,0,-4], [0,0,0], [0,1,0]);
const _viewMatrix = camMatrix.inverse();
const projMatrix = mat4.perspective(90, WIDTH/HEIGHT, 0.01, 500.0);

let shader, rubiks;

// TODO: This is just a test, lol
let move, move_U, move_M, move_D;

async function setup(){
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CW);

	const v = gl2 === null ? '' : '2';

  shader = await Shader.loadFromFile(
		gl, 
		`shaders/quad_vert${v}.glsl`, 
		`shaders/quad_frag${v}.glsl`
	);
  rubiks = new Rubiks(gl, shader, 3);

  // TODO: Testing purposes, lol
  const uy = [], my = [], dy = [];
  for(let i=0,x=0;x<3;x++)
  for(let y=0;y<3;y++)
  for(let z=0;z<3;z++){
    if(x>0&&x<2&&y>0&&y<2&&z>0&&z<2) continue;
    if(y === 2) uy.push(rubiks.cubes[i]);
    if(y === 1) my.push(rubiks.cubes[i]);
    if(y === 0) dy.push(rubiks.cubes[i]);
    i++;
  }
  move_U = new Move(Axis.Y,  1, uy);
  move_M = new Move(Axis.Y,  1, my);
  move_D = new Move(Axis.Y,  1, dy);
}

const keys = {};
function onKeyPressed(key, code){
  if(code >= 256) return;
  keys[key] = true;

  if(keys['CONTROL'] && keys['R']) window.location.href += '';

  handle_movement();
}
function onKeyReleased(key, code){
  if(code >= 256) return;
  keys[key] = false;
}

let tick = 0, angle;
function update(){
  tick++;
  angle = (tick%500)*TWO_PI/500;

  if(move) move.update();

  document.querySelector('#FPS').innerText = `${window.fps || 0} fps`;
}

function draw(){
  gl.viewport(0, 0, WIDTH, HEIGHT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(51/255, 51/255, 51/255, 1.0);

  const viewMatrix = _viewMatrix
    .translate(0, 0, 4)
    .rotateX(-Math.PI/6)
    .rotateY(-Math.PI/4);

  rubiks.setCamera(projMatrix, viewMatrix);
  rubiks.draw();
}

function handle_movement(){
  let nextMove;
  if(keys['U']) nextMove = move_U;
  if(keys['M']) nextMove = move_M;
  if(keys['D']) nextMove = move_D;
  if(!nextMove) return;

  nextMove.dir = keys['SHIFT'] ? -1 : 1;
  
  if(move && !move.done) return;
  move = nextMove;
  if(move.done) move.start();
}

let lastTime=performance.now(), unprocessedTime = 0, ticks = 0, frames = 0;
let lastTimer=performance.now();
function animate(time=0){
  const now = performance.now();
  unprocessedTime += (now - lastTime) / msPerTick;
  lastTime = now;
  let shouldRender = false;
  while(unprocessedTime >= 1){
    update();
    unprocessedTime--;
    ticks++;
    shouldRender = true;
  }

  if(shouldRender){
    draw();
    frames++;
  }

  const timer = performance.now();
  if(timer - lastTimer >= 1000){
    window.fps = frames;
    ticks = frames = 0;
    lastTimer += 1000;
  }

  requestAnimationFrame(animate);
}

function onKeyEvent(callback){ return e => { e.preventDefault(); callback(e.key.toUpperCase(), e.keyCode); } }
window.onkeyup   = onKeyEvent(onKeyReleased);
window.onkeydown = onKeyEvent(onKeyPressed);

Promise.resolve(setup()).then(animate);

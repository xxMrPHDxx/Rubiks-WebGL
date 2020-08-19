import Shader from './js/shader.js';
import Rubiks from './js/rubiks.js';

const canvas = document.querySelector('canvas#screen');
canvas.setAttribute('width', window.WIDTH = innerWidth);
canvas.setAttribute('height', window.HEIGHT = innerHeight);
const gl2 = canvas.getContext('webgl2');
const gl = gl2 === null ? 
						canvas.getContext('webgl') :
						gl2;
const FPS = 30;
const msPerTick = 1000/FPS;

const camMatrix = mat4.lookAt([0,0,-4], [0,0,0], [0,1,0]);
const _viewMatrix = camMatrix.inverse();
const projMatrix = mat4.perspective(90, WIDTH/HEIGHT, 0.01, 500.0);

let shader, rubiks;

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
  rubiks = new Rubiks(gl, shader, 5);
}

let tick = 0;
function update(){
  tick++;
  document.querySelector('#FPS').innerText = `${window.fps || 0} fps`;
}

function draw(){
  gl.viewport(0, 0, WIDTH, HEIGHT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(51/255, 51/255, 51/255, 1.0);

  const angle = (Date.now()%10000)*2*Math.PI/10000;
  const viewMatrix = _viewMatrix
    .translate(0, 0, 16)
    .rotateX(-Math.PI/4)
    .rotateY(angle);

  rubiks.setCamera(projMatrix, viewMatrix);
  rubiks.draw();
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

Promise.resolve(setup()).then(animate);

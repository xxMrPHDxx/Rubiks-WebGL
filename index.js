import Shader from './js/shader.js';
import Rubiks from './js/rubiks.js';

const canvas = document.querySelector('canvas#screen');
canvas.setAttribute('width', window.WIDTH = innerWidth);
canvas.setAttribute('height', window.HEIGHT = innerHeight);
const gl = canvas.getContext('webgl2');
const FPS = 30;
const msPerTick = 1000/FPS;

const camMatrix = mat4.lookAt([0,0,-4], [0,0,0], [0,1,0]);
const _viewMatrix = camMatrix.inverse();
const projMatrix = mat4.perspective(90, WIDTH/HEIGHT, 0.01, 500.0);

let shader, rubiks;

async function setup(){
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  shader = await Shader.loadFromFile(gl, 'shaders/quad_vert.glsl', 'shaders/quad_frag.glsl');
  rubiks = new Rubiks(gl, shader, 10);
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
    // .translate(0, 0, Math.sin(angle)*2+2)
    .rotateX(-Math.PI/4)
    .rotateY(angle);

  rubiks.setCamera(projMatrix, viewMatrix);
  rubiks.draw();
}

let lastTime=performance.now(), unprocessedTime = 0, ticks = 0, frames = 0;
function animate(time=0){
  const now = performance.now();
  unprocessedTime += (now - lastTime) / msPerTick;
  lastTime = now;
  while(unprocessedTime >= 1){
    update();
    unprocessedTime--;
    ticks++;
    if(ticks == 60){
      window.fps = frames;
      ticks = frames = 0;
    }
  }
  draw();
  frames++;
  setTimeout(animate, 1000/FPS);
  // requestAnimationFrame(animate);
}

Promise.resolve(setup()).then(animate);
import Shader from './shader.js';

const toRad = deg => deg * Math.PI / 180;

export default class Quad {
  constructor(gl, shader){
    this.gl = gl;
    this.shader = shader;

    // Enable depth
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    // Bind the shader program
    this.shader.use();

    // Get the attrib and uniform locations
    this.loc = {
      a_pos:  this.shader.getAttribLocation("a_pos"),
      u_view: this.shader.getUniformLocation("u_viewMatrix"),
      u_cam:  this.shader.getUniformLocation("u_camMatrix"),
      u_obj:  this.shader.getUniformLocation("u_objMatrix"),
      u_col:  this.shader.getUniformLocation("u_color"),
    }

    // Set up buffer for vertices
    const arrVerts = new Float32Array([
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5,  0.5, 0.0,
      -0.5,  0.5, 0.0
    ]);
    this.bufVerts = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVerts);
    gl.bufferData(gl.ARRAY_BUFFER, arrVerts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Set up buffer for vertex indices
    const arrIdxs = new Int16Array([0,1,2,0,2,3]);
    this.bufIdxs = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdxs);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrIdxs, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Unbind the shader program
    this.shader.unuse();
  }
  setCamera(viewMatrix, camMatrix){
    this.shader.use();
    this.gl.uniformMatrix4fv(this.loc.u_view, false, viewMatrix);
    this.gl.uniformMatrix4fv(this.loc.u_cam, false, camMatrix);
    this.shader.unuse();
  }
  draw(pos, cube_angle, angle, size, color=[1.0,1.0,1.0,1.0], flag=0){
    const gl = this.gl;
    const [x, y, z]     = [pos.x-size/2, pos.y-size/2, pos.z-size/2];
    const [l,r,u,d,f,b] = [0,1,2,3,4,5].map(s=>(flag&(1<<s))>>s);
    const [my, mz, mx]  = [!(l||r), !(u||d), !(f||b)];
    this.shader.use();

    // Set the object transform
    let objMatrix = mat4.identity();

    // Rotation for move execution, perhaps?
    objMatrix = objMatrix.translate(-size/2, -size/2, -size/2);
    if(cube_angle.x > 0 && (l || my || r)) objMatrix = objMatrix.rotateX(cube_angle.x);
    if(cube_angle.y > 0 && (u || mz || d)) objMatrix = objMatrix.rotateY(cube_angle.y);
    if(cube_angle.z > 0 && (f || mx || b)) objMatrix = objMatrix.rotateZ(cube_angle.z);
    objMatrix = objMatrix.translate(size/2, size/2, size/2);

    // Face and quad rotation
    objMatrix = objMatrix
      .translate(x+0.5, y+0.5, z+0.5)
      .rotateX(toRad(angle.x)).rotateY(toRad(angle.y)).rotateZ(toRad(angle.z))
      .scale(size*0.99, size*0.99, size*0.99);

    // Set the uniforms data
    gl.uniformMatrix4fv(this.loc.u_obj, false, objMatrix);
    gl.uniform4f(this.loc.u_col, ...color);
  
    // Bind all buffers for drawing and draw the quad
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVerts);
    gl.enableVertexAttribArray(this.loc.a_pos);
    gl.vertexAttribPointer(this.loc.a_pos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdxs);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    this.shader.unuse();
  }
}
const GL = WebGLRenderingContext;

export default class Shader {
  constructor(gl, vertexSrc, fragmentSrc){
    this.gl = gl;
    const vertex = Shader.compile(gl, vertexSrc, GL.VERTEX_SHADER);
    const fragment = Shader.compile(gl, fragmentSrc, GL.FRAGMENT_SHADER);
    this.program = Shader.createProgram(gl, vertex, fragment);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  }
  use(){
    this.gl.useProgram(this.program);
  }
  getAttribLocation(name){
    return this.gl.getAttribLocation(this.program, name);
  }
  getUniformLocation(name){
    return this.gl.getUniformLocation(this.program, name);
  }
  unuse(){
    this.gl.useProgram(null);
  }
  static compile(gl, src, type){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, GL.COMPILE_STATUS))
      throw (type === GL.VERTEX_SHADER ? 'Vertex' : 'Fragment') + 
        "Shader " + gl.getShaderInfoLog(shader);
    return shader;
  }
  static createProgram(gl, vertex, fragment){
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, GL.LINK_STATUS))
      throw gl.getProgramInfoLog(program);
    return program;
  }
  static loadFromFile(gl, vertPath, fragPath){
    const getText = path => fetch(path).then(res=>res.text());
    return Promise.all([
      getText(vertPath),
      getText(fragPath),
    ])
    .then(([vertSrc, fragSrc])=>new Shader(gl, vertSrc, fragSrc));
  }
}
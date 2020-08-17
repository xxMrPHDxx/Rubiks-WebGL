class vec3 extends Float32Array {
  constructor(x, y, z){
    super([x||0, y||0, z||0]);
  }
  get x(){ return this[0]; }
  get y(){ return this[1]; }
  get z(){ return this[2]; }
  set x(val){ if(typeof val === 'number') this[0] = val; }
  set y(val){ if(typeof val === 'number') this[1] = val; }
  set z(val){ if(typeof val === 'number') this[2] = val; }
  add(rhs){
    if(!rhs || rhs.length !== 3)
      throw new Error('Failed to add', rhs);
    const [x, y, z] = rhs;
    return new vec3(this.x+x, this.y+y, this.z+z);
  }
}

class vec4 extends Float32Array {
  constructor(x, y, z, w){
    super([x||0, y||0, z||0, w||0]);
  }
  get x(){ return this[0]; }
  get y(){ return this[1]; }
  get z(){ return this[2]; }
  get w(){ return this[3]; }
  set x(val){ if(typeof val === 'number') this[0] = val; }
  set y(val){ if(typeof val === 'number') this[1] = val; }
  set z(val){ if(typeof val === 'number') this[2] = val; }
  set w(val){ if(typeof val === 'number') this[3] = val; }
}

class mat3 extends Float32Array {
  constructor(...data){
    if(data[0] && typeof data[0].length === 'number')
      data = data[0];
    super(Array(9).fill().map((_,i)=>{
      if(i >= data.length) return 0;
      return typeof data[i] === 'number' ? data[i] : 0.0;
    }));
  }
  mult(rhs){
    if(!rhs || ![3, 9].includes(rhs.length))
      throw new Error('Cannot multiply', rhs);
    const clazz = rhs.length === 3 ? vec3 : mat3;
    return glMatrix.mat4.mul(new clazz, this, rhs);
  }
}

class mat4 extends Float32Array {
  constructor(...data){
    if(data[0] && typeof data[0].length === 'number')
      data = data[0];
    super(Array(16).fill().map((_,i)=>{
      if(i >= data.length) return 0;
      return typeof data[i] === 'number' ? data[i] : 0.0;
    }));
  }
  inverse(){
    return glMatrix.mat4.invert(new mat4, this);
  }
  mult(rhs){
    if(!rhs || ![4, 16].includes(rhs.length))
      throw new Error('Cannot multiply', rhs);
    const clazz = rhs.length === 4 ? vec4 : mat4;
    return glMatrix.mat4.mul(new clazz, this, rhs);
  }
  rotateX(rad){
    return glMatrix.mat4.rotateX(new mat4, this, rad);
  }
  rotateY(rad){ 
    return glMatrix.mat4.rotateY(new mat4, this, rad);
  }
  rotateZ(rad){ 
    return glMatrix.mat4.rotateZ(new mat4, this, rad);
  }
  scale(x, y, z){
    if(x.length === 3) [x, y, z] = x;
    return glMatrix.mat4.scale(new mat4, this, [x||0, y||0, z||0]);
  }
  translate(x, y, z){
    if(x.length === 3) [x, y, z] = x;
    return glMatrix.mat4.translate(new mat4, this, [x||0, y||0, z||0]);
  }
  static identity(){
    return new mat4(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
  }
  static lookAt(eye, target, up){
    if(!eye || !target || !up || eye.length !== 3 || target.length !== 3 || up.length !== 3)
      throw new Error('Invalid arguments', eye, target, up);
    return glMatrix.mat4.lookAt(new mat4, eye, target, up);
  }
  static perspective(fovDegrees, aspect, near, far){
    return glMatrix.mat4.perspective(new mat4, fovDegrees*Math.PI/180, aspect, near, far);
  }
}
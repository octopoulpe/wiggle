'use strict';

var ctx = require('./context').ctx;

var Buffer = function (isIndices) {
    var gl = ctx().gl;
    this._glBuffer = gl.createBuffer();
    this._count = 0;
    this._vertices = [];
    this.style = gl.ARRAY_BUFFER;
    this.arrayType = Float32Array;
    this.indices = false;
    if (isIndices) {
        this.indices = true;
        this.style = gl.ELEMENT_ARRAY_BUFFER;
        this.arrayType = Uint16Array;
    }
};

Buffer.prototype.add = function (vertices) {
    for (var i = 0; i < vertices.length; i++) {
        this._vertices.push.apply(this._vertices, vertices[i]);
    }
};

Buffer.prototype.addFlat = function (vertices) {
    this._vertices.push.apply(this._vertices, vertices);
};

Buffer.prototype.addIdx = function (vertices, indices) {
    for (var idx = 0; idx < indices.length; idx++) {
        this._vertices.push.apply(this._vertices, vertices[indices[idx]]);
    }
};

Buffer.prototype.addFlatIdx = function (vertices, indices) {
    for (var idx = 0; idx < indices.length; idx++) {
        this._vertices.push(vertices[indices[idx]]);
    }
};

Buffer.prototype.addN = function (vertex, count) {
    for (var i = 0; i < count; i++) {
        this._vertices.push.apply(this._vertices, vertex);
    }
};

Buffer.prototype.commit = function (dynamic) {
    var gl = ctx().gl;
    var drawMode = gl.STATIC_DRAW;
    if (dynamic) {
        drawMode = gl.DYNAMIC_DRAW;
    }
    console.log(this.style, this._glBuffer);
    gl.bindBuffer(this.style, this._glBuffer);
    gl.bufferData(this.style, new this.arrayType(this._vertices), drawMode);
    this._count = this._vertices.length;
};

Buffer.prototype.bind = function (attributeName) {
    var gl = ctx().gl;
    var shaderAttr = ctx().shaderInUse.attributes[attributeName];
    if (!this.indices) {
        // enableVertexAttribArray is VAO-scoped !!!
        gl.enableVertexAttribArray(shaderAttr.handler);
    }
    gl.bindBuffer(this.style, this._glBuffer);
    if (this.indices) {
        return;
    }
    gl.vertexAttribPointer(
        shaderAttr.handler,
        shaderAttr.size,
        gl.FLOAT,
        false,
        0,
        0
    );
    return this._count / shaderAttr.size;
};

Buffer.prototype.delete = function () {
    ctx().gl.deleteBuffer(this._glBuffer);
};


var BufferArray = function (buffers) {
    this._vao = ctx().gl.createVertexArray();
    this._buffers = {};
    this._indexBuffer = null;
    this._count = 0;
    for (var i = 0; i < buffers.length; i++) {
        this._buffers[buffers[i]] = new Buffer();
    }
};

BufferArray.prototype.buff = function (name) {
    return this._buffers[name];
};

BufferArray.prototype.setIndices = function (indices) {
    this._indexBuffer = new Buffer(true);
    this._indexBuffer.addFlat(indices);
    this._indexBuffer.commit();
};

BufferArray.prototype.commit = function (dynamic) {
    var gl = ctx().gl;
    for (var attributeName in this._buffers) {  // jshint ignore:line
        this._buffers[attributeName].commit(dynamic);
    }
    gl.bindVertexArray(this._vao);
    for (var attributeName in this._buffers) {  // jshint ignore:line
        // count *should* be the same for every buffer in the array
        // Add a check ?
        this._count = this._buffers[attributeName].bind(attributeName);
    }
    gl.bindVertexArray(null);
};

BufferArray.prototype.draw = function () {
    var gl = ctx().gl;
    gl.bindVertexArray(this._vao);
    if (this._indexBuffer) {
        this._indexBuffer.bind();
        gl.drawElements(gl.TRIANGLES, this._indexBuffer._count, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.drawArrays(gl.TRIANGLES, 0, this._count);
    }
    gl.bindVertexArray(null);
};

BufferArray.prototype.delete = function () {
    for (var attributeName in this._buffers) {  // jshint ignore:line
        this._buffers[attributeName].delete();
    }
    this._buffers = {};
    ctx().gl.deleteVertexArray(this._vao);
    this._vao = null;
    this._count = 0;
};


module.exports = {
    Buffer: Buffer,
    BufferArray: BufferArray
};

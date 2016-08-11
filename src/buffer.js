"use strict";

var ctx = require("./context").ctx;

var Buffer = function () {
    this._glBuffer = null;
    this._glBuffer = ctx().gl.createBuffer();
    this._count = 0;
};

Buffer.prototype.setData = function (vertices, dynamic) {
    var gl = ctx().gl;
    var drawMode = gl.STATIC_DRAW;
    if (dynamic) {
        drawMode = gl.DYNAMIC_DRAW;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), drawMode);
    this._count = vertices.length;
};

Buffer.prototype.bind = function (attributeName) {
    var gl = ctx().gl;
    var shaderAttr = ctx().shaderInUse.attributes[attributeName];
    gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
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
    this._buffers = {};
    for (var i = 0; i < buffers.length; i++) {
        this._buffers[buffers[i]] = new Buffer();
    }
};

BufferArray.prototype.setData = function (newData, dynamic) {
    for (var attributeName in newData) {  // jshint ignore:line
        this._buffers[attributeName].setData(
            newData[attributeName],
            dynamic
        );
    }
};

BufferArray.prototype.draw = function () {
    var gl = ctx().gl;
    var count = 0;
    for (var attributeName in this._buffers) {  // jshint ignore:line
        // count *should* be the same for every buffer in the array
        // Add a check ?
        count = this._buffers[attributeName].bind(attributeName);
    }
    gl.drawArrays(gl.TRIANGLES, 0, count);
};

BufferArray.prototype.delete = function () {
    for (var attributeName in this._buffers) {  // jshint ignore:line
        this._buffers[attributeName].delete();
    }
    this._buffers = {};
};


module.exports = {
    Buffer: Buffer,
    BufferArray: BufferArray
};

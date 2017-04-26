"use strict";

var mat4 = require("gl-matrix").mat4;
var ctx = require("./context").ctx;


var Projection = function (uniformName, halfScreen) {
    this._projMat = mat4.create();
    this._uniformName = uniformName;
    this._halfScreen = halfScreen || 3;
};

Projection.prototype.ortho = function () {
    var gl = ctx().gl;
    var context = ctx();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    var screenRatio = context.canvas.height / context.canvas.width;

    var halfScreenX = this._halfScreen;
    var halfScreenY = this._halfScreen * screenRatio;

    mat4.ortho(
        this._projMat,
        -halfScreenX,
        halfScreenX,
        -halfScreenY,
        halfScreenY,
        -1,
        1
    );
};

Projection.prototype.expose = function () {
    ctx().shaderInUse.uniforms[this._uniformName](false, this._projMat);
};

module.exports = Projection;

"use strict";

var mat4 = require("gl-matrix").mat4;
var ctx = require("./context").ctx;

var HALF_SCREEN = 3;

var Camera = function (uniformName) {
    this._projMat = mat4.create();
    this._uniformName = uniformName;
    this._lastPosX = 0.0;
    this._lastPosY = 0.0;
};

Camera.prototype.set = function (x, y) {
    var gl = ctx().gl;
    var context = ctx();

    if (x === undefined) {
        x = this._lastPosX;
    }
    if (y === undefined) {
        y = this._lastPosY;
    }
    this._lastPosX = x;
    this._lastPosY = y;

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    var screenRatio = context.canvas.height / context.canvas.width;

    // trying to align camera on full pixels to remove some artifacts
    var realHalfScreenX = gl.drawingBufferWidth / (~~(gl.drawingBufferWidth / HALF_SCREEN) + 1);
    var realHalfScreenY = gl.drawingBufferHeight / (~~(gl.drawingBufferHeight / (HALF_SCREEN * screenRatio)) + 1);

    mat4.ortho(
        this._projMat,
        -realHalfScreenX + x,
        realHalfScreenX + x,
        -realHalfScreenY + y,
        realHalfScreenY + y,
        -1,
        1
    );
};

Camera.prototype.move = function (x, y) {
    x = x || 0.0;
    y = y || 0.0;
    mat4.translate(this._projMat, this._projMat, [-x, -y, 0.0]);
};

Camera.prototype.expose = function () {
    ctx().shaderInUse.uniforms[this._uniformName](false, this._projMat);
};

module.exports = Camera;

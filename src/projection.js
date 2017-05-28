'use strict';

var mat4 = require('gl-matrix').mat4;
var ctx = require('./context').ctx;


var Projection = function (uniformName) {
    this._projMat = mat4.create();
    this._uniformName = uniformName;
};

Projection.prototype.ortho = function (halfScreenWidth) {
    var context = ctx();
    halfScreenWidth = halfScreenWidth || 3;

    var screenRatio = context.canvas.height / context.canvas.width;

    var halfScreenX = halfScreenWidth;
    var halfScreenY = halfScreenWidth * screenRatio;

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

Projection.prototype.perspective = function (fovy, near, far) {
    var context = ctx();
    fovy = fovy || 1.5708;  // 90°
    near = near || 0.1;
    far = far || 10;

    var screenRatio = context.canvas.width / context.canvas.height;

    mat4.perspective(//out, fovy, aspect, near, far)(
        this._projMat,
        fovy,
        screenRatio,
        near,
        far
    );
};

Projection.prototype.expose = function () {
    ctx().shaderInUse.uniforms[this._uniformName](false, this._projMat);
};

module.exports = Projection;

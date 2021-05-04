'use strict';

var mat4 = require('gl-matrix').mat4;
var ctx = require('./context').ctx;


var Projection = function (uniformName) {
    this._projMat = mat4.create();
    this._uniformName = uniformName;
    this.halfScreenWidth = ctx().globs.conf.halfScreen;

};

Projection.prototype.ortho = function (halfScreenWidth) {
    var context = ctx();
    halfScreenWidth = halfScreenWidth || this.halfScreenWidth;
    this.halfScreenWidth = halfScreenWidth;

    var screenRatio = context.canvas.height / context.canvas.width;

    var halfScreenX = halfScreenWidth;
    var halfScreenY = halfScreenWidth * screenRatio;

    mat4.ortho(
        this._projMat,
        -halfScreenX,
        halfScreenX,
        -halfScreenY,
        halfScreenY,
        -100,
        100
    );
};

Projection.prototype.getPointerPos = function () {
    var context = ctx();
    var pixToUnitRatio = 2 * this.halfScreenWidth / context.canvas.width;
    var mouseX = context.pointerX - context.canvas.width / 2;
    var mouseY = -(context.pointerY - context.canvas.height / 2);
    return [mouseX * pixToUnitRatio, mouseY * pixToUnitRatio];
};

Projection.prototype.perspective = function (fovy, near, far) {
    var context = ctx();
    fovy = fovy || 1.5708;  // 90°
    near = near || 0.1;
    far = far || 100;

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

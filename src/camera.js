"use strict";

var mat4 = require("gl-matrix").mat4;
var ctx = require("./context").ctx;


var Camera = function (uniformName) {
    this._viewMat = mat4.create();
    this._stagingViewMat = mat4.create();
    this._uniformName = uniformName;
    this.x = 0;
    this.y = 0;
    this.z = 1;
};

Camera.prototype.set = function (x, y, z) {
    if (x !== undefined) {
        this.x = x;
    }
    if (y !== undefined) {
        this.y = y;
    }
    if (z !== undefined) {
        this.z = z;
    }
    mat4.identity(this._viewMat);
    mat4.translate(
        this._viewMat,
        this._viewMat,
        [this.x, this.y, this.z]
    );
};

Camera.prototype.move = function (x, y, z) {
    x = x || 0;
    y = y || 0;
    z = z || 0;
    this.x += x;
    this.y += y;
    this.z += z;
    mat4.translate(
        this._viewMat,
        this._viewMat,
        [x, y, z]
    );
};

Camera.prototype.expose = function () {
    mat4.invert(this._stagingViewMat, this._viewMat);
    ctx().shaderInUse.uniforms[this._uniformName](false, this._stagingViewMat);
};

module.exports = Camera;

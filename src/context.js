"use strict";

var currentContext = null;

var Context = function (canvasId) {
    var gl;
    this.canvas = document.getElementById(canvasId);

    try {
        gl = this.canvas.getContext("webgl");
    } catch (e) {
        alert("Could not initialise WebGL, sorry :-(");
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }

    this.gl = gl;
    this.shaderInUse = null;
    this.resizeCallbacks = [];
    this.globs = {};

    this._setFlags();
    this._prepareGlobs();

    currentContext = this;
};

Context.prototype._setFlags = function () {
    var gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

Context.prototype._prepareGlobs = function () {
    var gl = this.gl;
    var globs = this.globs;

    globs.unifMap = {};
    globs.unifMap[gl.INT] = gl.uniform1i;
    globs.unifMap[gl.FLOAT] = gl.uniform1f;
    globs.unifMap[gl.FLOAT_VEC2] = gl.uniform2fv;
    globs.unifMap[gl.FLOAT_VEC3] = gl.uniform3fv;
    globs.unifMap[gl.FLOAT_VEC4] = gl.uniform4fv;
    globs.unifMap[gl.INT_VEC2] = gl.uniform2iv;
    globs.unifMap[gl.INT_VEC3] = gl.uniform3iv;
    globs.unifMap[gl.INT_VEC4] = gl.uniform4iv;
    globs.unifMap[gl.FLOAT_MAT2] = gl.uniformMatrix2fv;
    globs.unifMap[gl.FLOAT_MAT3] = gl.uniformMatrix3fv;
    globs.unifMap[gl.FLOAT_MAT4] = gl.uniformMatrix4fv;
    globs.unifMap[gl.SAMPLER_2D] = gl.uniform1i;

    globs.attrMap = {};
    globs.attrMap[gl.FLOAT] = 1;
    globs.attrMap[gl.FLOAT_VEC2] = 2;
    globs.attrMap[gl.FLOAT_VEC3] = 3;
    globs.attrMap[gl.FLOAT_VEC4] = 4;
};

Context.prototype._setFlags = function () {
    var gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

Context.prototype.resizeIfNeeded = function () {
    var width = this.canvas.clientWidth;
    var height = this.canvas.clientHeight;
    if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.resizeCallbacks.forEach(function (handler) {
            handler();
        });
    }
};

Context.prototype.clear = function () {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

var ctx = function () {
    return currentContext;
};

module.exports = {
    Context: Context,
    ctx: ctx,
};

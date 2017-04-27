"use strict";

var mat4 = require("gl-matrix").mat4;
var ctx = require("./context").ctx;
var graph = require("./graph");


var Camera = function (uniformName) {
    this._stagingViewMat = mat4.create();
    this._uniformName = uniformName;
    this.node = new graph.GraphNode(new graph.Transform());
};

Camera.prototype.expose = function () {
    //console.log(this.stagingMat.getTranslation());
    mat4.invert(this._stagingViewMat, this.node.getBubbledMat());
    ctx().shaderInUse.uniforms[this._uniformName](false, this._stagingViewMat);
};

module.exports = Camera;

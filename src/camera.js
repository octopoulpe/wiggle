'use strict';

var mat4 = require('gl-matrix').mat4;
var ctx = require('./context').ctx;
var graph = require('./graph');


var Camera = function (uniformName) {
    this._stagingViewMat = mat4.create();
    this._uniformName = uniformName;
    this.node = new graph.GraphNode(new graph.Transform());
};

Camera.prototype.expose = function () {
    mat4.invert(this._stagingViewMat, this.node.getBubbledMat());
    ctx().shaderInUse.uniforms[this._uniformName](false, this._stagingViewMat);
};

Camera.prototype.screenTo2dWorld = function (screenPos) {
    return [
        screenPos[0] + this.node.transform.tX,
        screenPos[1] + this.node.transform.tY
    ];
};

Camera.prototype.world2dPos = function () {
    return [this.node.transform.tX, this.node.transform.tY, ];
};

module.exports = Camera;

'use strict';

var mat4 = require('gl-matrix').mat4;
var quat = require('gl-matrix').quat;


var Transform = function () {
    this.tX = 0;
    this.tY = 0;
    this.tZ = 0;
    this.rX = 0;
    this.rY = 0;
    this.rZ = 0;
    this.sX = 1;
    this.sY = 1;
    this.sZ = 1;
    this.transformMat = mat4.create();
    this.rotationQuat = quat.create();
};

Transform.prototype.refresh = function () {
    var rotationQuat = this.rotationQuat;
    quat.identity(rotationQuat);
    quat.rotateX(rotationQuat, rotationQuat, this.rX);
    quat.rotateY(rotationQuat, rotationQuat, this.rY);
    quat.rotateZ(rotationQuat, rotationQuat, this.rZ);
    mat4.fromRotationTranslationScale(
        this.transformMat,
        rotationQuat,
        [this.tX, this.tY, this.tZ],
        [this.sX, this.sY, this.sZ]
    );
};


var GraphNode = function (transform) {
    this.transform = transform;
    this.parent = null;
    this.stagingMat = mat4.create();
};

GraphNode.prototype.getBubbledMat = function () {
    mat4.identity(this.stagingMat);
    if (this.parent) {
        mat4.multiply(
            this.stagingMat,
            this.parent.getBubbledMat(),
            this.transform.transformMat
        );
    } else {
        mat4.multiply(
            this.stagingMat,
            this.stagingMat,
            this.transform.transformMat
        );
    }
    return this.stagingMat;
};


module.exports = {
    GraphNode: GraphNode,
    Transform: Transform
};
